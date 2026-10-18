import type { Metadata } from "next";
import { SavedClient } from "@/components/SavedClient";

export const metadata: Metadata = { title: "Saved properties", robots: { index: false } };

export default function SavedPage() {
  return <SavedClient />;
}
