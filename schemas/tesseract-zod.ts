import { z } from 'zod';

const zMetric = z.object({
  value: z.union([z.number(), z.string()]),
  label: z.string().optional(),
  suffix: z.string().optional(),
  prefix: z.string().optional(),
});

export default z.object({
  organisation: z.string().min(1),
  reportDate: z.string().regex(/\d{4}-\d{2}-\d{2}/),
  hxScore: z.object({ value: z.number().min(0).max(10), delta: z.number() }).required(),
  employees: z
    .object({
      total: z.number().int().min(0),
      home: z.number().int().min(0),
      office: z.number().int().min(0),
      hybrid: z.number().int().min(0),
      hybrid0: z.number().int().min(0),
      hybrid20: z.number().int().min(0),
      hybrid40: z.number().int().min(0),
      hybrid60: z.number().int().min(0),
      hybrid80: z.number().int().min(0),
    })
    .required(),
  workingLocations: z
    .object({
      homeScore: z.number().min(0).max(10),
      homeSufferingPercent: z.number().min(0).max(100),
      homeFrustratedPercent: z.number().min(0).max(100),
      homeSatisfiedPercent: z.number().min(0).max(100),
      officeScore: z.number().min(0).max(10),
      officeSufferingPercent: z.number().min(0).max(100),
      officeFrustratedPercent: z.number().min(0).max(100),
      officeSatisfiedPercent: z.number().min(0).max(100),
    })
    .required(),
  scores: z
    .object({
      suffering: z.object({
        employeeCount: z.number().int().min(0),
        band1: z.number().int().min(0),
        band2: z.number().int().min(0),
        band3: z.number().int().min(0),
        band4: z.number().int().min(0),
      }),
      frustrated: z.object({
        employeeCount: z.number().int().min(0),
        band5: z.number().int().min(0),
        band6: z.number().int().min(0),
        band7: z.number().int().min(0),
      }),
      satisfied: z.object({
        employeeCount: z.number().int().min(0),
        band8: z.number().int().min(0),
        band9: z.number().int().min(0),
        band10: z.number().int().min(0),
      }),
    })
    .required(),
  metrics: z
    .object({
      currency: z.string().optional(),
      wellbeing: z.object({ value: z.number().min(0), delta: z.number() }),
      equality: z.object({ value: z.string().min(0), delta: z.number() }),
      payroll: z.object({ value: z.number().int().min(0), delta: z.number() }),
      efficiency: z.object({ value: z.number().min(0), delta: z.number() }),
      revenue: z.object({ value: z.number().int().min(0), delta: z.number() }),
    })
    .required(),
  blockData: z
    .record(
      z.string(),
      z.object({
        title: z.string().min(0),
        subtitle: z.string(),
        text: z.array(z.string()),
        metrics: z.record(z.string().min(1), zMetric),
        table: z
          .object({
            title: z.string().min(0),
            rows: z.array(zMetric),
          })
          .optional(),
        chartData: z.record(z.string().min(1), z.number()).optional(),
      })
    )
    .optional(),
});
