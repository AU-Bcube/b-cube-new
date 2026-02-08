import dbConnect from "@/lib/mongodb";
import StudyModel from "@/lib/models/Study";
import InterviewModel from "@/lib/models/Interview";
import ExecutivesModel from "@/lib/models/Executives";
import ContactModel from "@/lib/models/Contact";
import PhotoModel from "@/lib/models/Photo";
import ActivitiesModel from "@/lib/models/Activities";
import SexyItModel from "@/lib/models/SexyIt";
import DesigntonModel from "@/lib/models/Designton";
import EtcModel from "@/lib/models/Etc";
import type {
  Study,
  Interview,
  Executive,
  Contact,
  Photo,
  Activity,
  SexyIt,
  Designton,
  Etc,
} from "@/types";

export async function getStudies(): Promise<Study[]> {
  await dbConnect();
  const docs = await StudyModel.find().sort({ year: -1 }).lean();
  return docs.map((s) => ({
    id: (s._id as object).toString(),
    year: s.year,
    title: s.title,
    imagePath: s.imagePath,
  }));
}

export async function getInterviews(): Promise<Interview[]> {
  await dbConnect();
  const docs = await InterviewModel.find().lean();
  return docs.map((i) => ({
    id: (i._id as object).toString(),
    name: i.name,
    studentId: String(i.studentId),
    introduction: i.introduction,
    imagePath: i.imagePath,
  }));
}

export async function getExecutives(): Promise<Executive[]> {
  await dbConnect();
  const docs = await ExecutivesModel.find().lean();
  return docs.map((e) => ({
    id: (e._id as object).toString(),
    name: e.name,
    role: e.role,
    studentId: e.studentId,
    imagePath: e.imagePath,
  }));
}

export async function getContact(): Promise<Contact> {
  await dbConnect();
  const doc = await ContactModel.findOne().lean();
  if (!doc) return { id: "", email: "", kakaotalkLink: "", instagramLink: "" };
  return {
    id: (doc._id as object).toString(),
    email: doc.email,
    kakaotalkLink: doc.kakaotalkLink,
    instagramLink: doc.instagramLink,
  };
}

export async function getPhotos(): Promise<Photo[]> {
  await dbConnect();
  const docs = await PhotoModel.find().sort({ date: -1 }).lean();
  return docs.map((p) => ({
    id: (p._id as object).toString(),
    description: p.description,
    date: p.date.toISOString().split("T")[0],
    imagePath: p.imagePath,
  }));
}

export async function getActivities(): Promise<Activity[]> {
  await dbConnect();
  const docs = await ActivitiesModel.find().lean();
  return docs.map((a) => ({
    id: (a._id as object).toString(),
    title: a.title,
    description: a.description,
    imagePath: a.imagePath,
    pdfPath: a.pdfPath,
  }));
}

export async function getSexyIts(): Promise<SexyIt[]> {
  await dbConnect();
  const docs = await SexyItModel.find().sort({ date: -1 }).lean();
  return docs.map((s) => ({
    id: (s._id as object).toString(),
    date: s.date.toISOString().split("T")[0],
    title: s.title,
    imagePath: s.imagePath,
    url: s.url,
  }));
}

export async function getDesigntons(): Promise<Designton[]> {
  await dbConnect();
  const docs = await DesigntonModel.find().sort({ year: -1 }).lean();
  return docs.map((d) => ({
    id: (d._id as object).toString(),
    title: d.title,
    year: d.year,
    participant: d.participant,
    imagePath: d.imagePath,
    pdfPath: d.pdfPath,
    award: d.award,
  }));
}

export async function getEtcs(): Promise<Etc[]> {
  await dbConnect();
  const docs = await EtcModel.find().sort({ year: -1 }).lean();
  return docs.map((e) => ({
    id: (e._id as object).toString(),
    title: e.title,
    year: e.year,
    participant: e.participant,
    imagePath: e.imagePath,
    pdfPath: e.pdfPath,
    award: e.award,
  }));
}
