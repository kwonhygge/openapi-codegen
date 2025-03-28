export function extractSchemaNameByRef(ref: string): string {
  const refParts = ref.split("/");
  return refParts[refParts.length - 1];
}
