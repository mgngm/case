import exports from 'styles/_exports.module.scss';

export interface SankeyLevers {
  hybridUpper: number;
  hybridLower: number;
}
interface EmployeeData {
  total: number;
  home: number;
  office: number;
  hybrid: number;
  levers?: SankeyLevers;
  hybridBreakdown: {
    0: number;
    20: number;
    40: number;
    60: number;
    80: number;
  };
}

export interface SankeyDataCell {
  id: string;
  value: number;
  title: string;
  color?: string;
  snakeColor?: string;
}

export interface SankeyData {
  totalEmployees: SankeyDataCell;
  levers: SankeyLevers;
  locationBreakdown: SankeyDataCell[];
  hybridBreakdown: SankeyDataCell[];
}

export const generateSankeyFromEmployeeData = (employeeData: EmployeeData): SankeyData => ({
  totalEmployees: {
    id: 'total',
    title: 'Total Employees',
    value: employeeData?.total ?? 0,
  },
  levers: {
    hybridUpper: employeeData?.levers?.hybridUpper ?? 0.95,
    hybridLower: employeeData?.levers?.hybridLower ?? 0.05,
  },
  locationBreakdown: [
    {
      id: 'home',
      value: employeeData?.home ?? 0,
      title: 'Home',
      color: exports.homeColor,
      snakeColor: exports.snakeHome,
    },
    {
      id: 'hybrid',
      value: employeeData?.hybrid ?? 0,
      title: 'Hybrid',
      color: exports.hybridColor,
      snakeColor: exports.snakeHybrid,
    },
    {
      id: 'office',
      value: employeeData?.office ?? 0,
      title: 'Office',
      color: exports.officeColor,
      snakeColor: exports.snakeOffice,
    },
  ],
  hybridBreakdown: [
    {
      id: 'hybrid0',
      value: employeeData?.hybridBreakdown[0] ?? 0,
      title: 'Up to 1 day',
      color: exports.hybridColor,
    },
    {
      id: 'hybrid20',
      value: employeeData?.hybridBreakdown[20] ?? 0,
      title: '1 - 2 days',
      color: exports.hybridColor,
    },
    {
      id: 'hybrid40',
      value: employeeData?.hybridBreakdown[40] ?? 0,
      title: '2 - 3 days',
      color: exports.hybridColor,
    },
    {
      id: 'hybrid60',
      value: employeeData?.hybridBreakdown[60] ?? 0,
      title: '3 - 4 days',
      color: exports.hybridColor,
    },
    {
      id: 'hybrid80',
      value: employeeData?.hybridBreakdown[80] ?? 0,
      title: 'Up to 5 days',
      color: exports.hybridColor,
    },
  ],
});
