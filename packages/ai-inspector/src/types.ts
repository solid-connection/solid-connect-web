export interface HoverRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ElementSelection {
  selector: string;
  tagName: string;
  className: string;
  textSnippet: string;
  rect: HoverRect;
}

export interface CreateAiInspectorRequestPayload {
  instruction: string;
  pageUrl: string;
  selection: ElementSelection;
}

export interface CreateAiInspectorRequestResponse {
  taskId: string;
  status: string;
}
