export interface JobTreeResponse {
  data: {
    projects: ProjectNode[];
  };
}

export interface ProjectNode {
  projectId: string;
  contractName: string;
  user: string;
  trains: TrainNode[];
  favourite?: boolean;
}

export interface TrainNode {
  trainId: string;
  trainName: string;
  childJobs: string[];
}

export interface ContractTreeItem {
  id: string;
  text: string;
  items?: ContractTreeItem[];
  isParent?: boolean;
  favourite?: boolean;
  parentId:string;
}