import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ContractExportColumns, ContractExportDetail, ContractTreeItem, ProjectNode } from './ProjectContract';

@Injectable({
  providedIn: 'root'
})
export class ProjectJobService {

    private selectedContractSource =  new BehaviorSubject<any[]>([]);
  selectedContracts$ = this.selectedContractSource.asObservable();

  constructor(private http : HttpClient) { }

  GetAdvanceFilter() : Observable<any>
  {
    return this.http.get<any>('/api/advanceFilter');
  }

  GetProjectContracts() : Observable<any>
  {
    return this.http.get<any>('/api/projectContracts');
  }

    getContractExportColumns(): Observable<ContractExportColumns> {
      return this.http.get<ContractExportColumns>('/api/allContractsColumns');
    }
  
   getContractExportDetail(): Observable<ContractExportDetail[]> {
      return this.http.get<ContractExportDetail[]>('/api/allContractsData');
    }

ConvertToTreeItems(projects: ProjectNode[]): ContractTreeItem[] {
  return projects.map(p => ({
    id: p.projectId,
    text: p.contractName,
    favourite: p.favourite,
    isParent: true,
    parentId:p.projectId,
    items: p.trains.map(t => ({
      id: t.trainId,
      text: t.trainName,
      parentId:p.projectId,
      items: t.childJobs.map(job => ({
        id: job,
        text: job,
        parentId:p.projectId,
      }))
    }))
  }));
}

  updateSelectedContracts(items: any[]) {

    this.selectedContractSource.next(items);
  }
}
