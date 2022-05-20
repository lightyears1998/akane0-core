export interface SemanticTreeNode {
  value?: string;
  parent: SemanticTreeNode | null;
  children: SemanticTreeNode[];

  expand(): void;
  conclude(): void;
}
