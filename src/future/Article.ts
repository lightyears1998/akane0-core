import { SemanticTreeNode } from "./SemanticTreeNode";

export class Article implements SemanticTreeNode {
  children: SemanticTreeNode[];
  parent: SemanticTreeNode | null;

  constructor() {
    this.children = [];
    this.parent = null;
  }

  expand() {
    return;
  }

  conclude() {
    return;
  }
}
