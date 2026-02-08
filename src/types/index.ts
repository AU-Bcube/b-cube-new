export type Study = {
  id: string;
  year: string;
  title: string;
  imagePath: string;
};

export type Interview = {
  id: string;
  name: string;
  studentId: string;
  introduction: string;
  imagePath: string;
};

export type Executive = {
  id: string;
  name: string;
  role: string;
  studentId: number;
  imagePath: string;
};

export type Contact = {
  id: string;
  email: string;
  kakaotalkLink: string;
  instagramLink: string;
  isRecruiting: boolean;
  recruitMessage?: string;
  recruitLink: string;
};

export type Photo = {
  id: string;
  description: string;
  date: string;
  imagePath: string;
};

export type Activity = {
  id: string;
  title: string;
  description: string;
  imagePath: string;
  pdfPath: string;
};

export type SexyIt = {
  id: string;
  date: string;
  title: string;
  imagePath: string;
  url: string;
};

export type Designton = {
  id: string;
  title: string;
  year: string;
  participant: string;
  imagePath: string;
  pdfPath: string;
  award?: string;
};

export type Etc = {
  id: string;
  title: string;
  year: string;
  participant: string;
  imagePath: string;
  pdfPath: string;
  award?: string;
};
