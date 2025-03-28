import { OpenAPIV2 } from "openapi-types";

export type ReferenceSchema = OpenAPIV2.ReferenceObject | OpenAPIV2.ItemsObject;

export type ResourceValue = {
  path: string;
  method: string;
  params: Record<string, unknown>;
  responseType: string | null;
};
