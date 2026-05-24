import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "../../../../../lib/mongodb.js";
import Summary from "../../../../../models/Summary.js";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const wiki = await Summary.findOne({ patientId: params.id }).lean();

    if (!wiki) {
      return NextResponse.json({
        wiki: {
          conditions: [],
          medications: [],
          surgeries: [],
          allergies: [],
          labValues: [],
          contradictions: [],
          criticalFlags: [],
          aiSummary: "",
          lastUpdated: null,
        },
      });
    }

    return NextResponse.json({ wiki });
  } catch (error) {
    console.error("[Wiki API] Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
