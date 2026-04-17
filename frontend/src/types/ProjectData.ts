export interface ProjectData {
  id: string;
  name: string;
  targetDeliveryDate: string;
  actualDeliveryDate: string;
  expectedRevenue: number;
  actualRevenue: number;
  expectedBreachCost: number;
  vulnerabilities: number;
  expectedPhases: number;
  actualPhases: number;
  intersectingProjects: number;
  reusableComponents: number;
}
