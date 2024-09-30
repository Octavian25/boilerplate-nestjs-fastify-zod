import { Schema } from 'mongoose';

// Middleware to add `edit_history` on all update operations
export function addEditHistory(schema: Schema) {
  // Pre-hook for capturing the original document before update
  async function captureOriginal(this: any, next: any) {
    const query = this.getQuery();
    const update = this.getUpdate();

    // Only proceed if the update is not a $setOnInsert
    if (update.$setOnInsert) return next();

    // Find the documents to be updated
    const docsToUpdate = await this.model.find(query);

    // Store the original documents in a property
    this._originalDocs = docsToUpdate.map((doc) => doc.toObject());
    next();
  }

  // Post-hook for updating the edit_history after update
  async function addChangelog(this: any, result: any, next: any) {
    if (result && result.matchedCount > 0) {
      const updatedDocs = await this.model.find(this.getQuery());
      const originalDocs = this._originalDocs || [];

      // Iterate over the original documents and their corresponding updates
      updatedDocs.forEach((updatedDoc: any, index: number) => {
        const originalDoc = originalDocs[index];
        const updateFields = findChangedKeys(
          originalDoc,
          updatedDoc.toObject(),
        );

        if (originalDoc) {
          var changelog = {
            before: filterKeys(originalDoc, updateFields),
            after: filterKeys(updatedDoc.toObject(), updateFields),
          };

          // Append changelog to edit_history
          updatedDoc.edit_history = updatedDoc.edit_history || [];
          updatedDoc.edit_history.push({
            edit_by: updatedDoc.toObject()?.edit_by, // Modify this to include the actual user if available
            edit_date: new Date(),
            changelog: JSON.stringify(changelog),
          });
          updatedDoc.b = false;

          // Save the document to persist the edit_history
          updatedDoc.save();
        }
      });
    }

    next();
  }

  // Apply pre-hooks to all update methods
  schema.pre(['updateOne', 'updateMany', 'findOneAndUpdate'], captureOriginal);

  // Apply post-hooks to all update methods
  schema.post(['updateOne', 'updateMany', 'findOneAndUpdate'], addChangelog);
}

export function findChangedKeys(
  before: any,
  after: any,
  excludeKeys: string[] = [
    '_id',
    'input_date',
    'input_by',
    'deleted_date',
    'deleted_by',
    'edit_history',
  ],
): string[] {
  const changedKeys: string[] = [];

  // Loop through the keys of the 'after' object to compare with 'before'
  Object.keys(after).forEach((key) => {
    // Skip the keys that are in the exclude list
    if (excludeKeys.includes(key)) return;

    // Compare 'before' and 'after' values, add to changedKeys if different
    if (before[key] !== after[key]) {
      changedKeys.push(key);
    }
  });

  return changedKeys;
}

export function filterKeys(data: any, keysToDisplay: string[]): any {
  const filteredData: any = {};

  // Iterate over each key in keysToDisplay and add it to filteredData if it exists in data
  keysToDisplay.forEach((key) => {
    if (data.hasOwnProperty(key)) {
      filteredData[key] = data[key];
    }
  });

  return filteredData;
}
