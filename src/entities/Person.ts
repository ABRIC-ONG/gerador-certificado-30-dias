export enum CertificationType {
  Mentor,
  Training,
  Mentee,
}

export interface Person {
  name: string;
  cpf: string;
  dataEmissao: Date;
  tipoCertificado: CertificationType;
}
