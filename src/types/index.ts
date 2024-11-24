export interface Item {
    id: string;
    title: string;
    icon: string;
    isFolder: boolean;
    parentId: string | null;
    order: number;
    items?: string[];
    isOpen?: boolean;
  }