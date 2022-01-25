export interface Evaluation {
    id: number,
    module: { id: number, name: string },
    employeeId: string;
    deadline: Date;
    status: number;
    prio: number;
}

export const defaultEvaluation = {
    id: null,
    module: { id: null, name: null },
    employeeId: null,
    deadline: null,
    status: 2,
    prio: 3
}