// app/api/pages/[slug]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/_lib/db';
import Page from '@/app/_models/Page';
import { PageDocument, ApiResponse } from '@/app/_types/PageData';

/**
 * @method GET
 * @description Fetches a page document by its slug.
 */
export async function GET(
    request: NextRequest, 
    { params }: { params: Promise<{ slug: string }> }
) {
    await connectToDatabase();
    const { slug } = await params;

    try {
        const page = await Page.findOne({ slug: slug });

        if (!page) {
            return NextResponse.json({ success: false, error: 'Page not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: page });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

/**
 * @method PUT
 * @description Updates an existing page document by its slug.
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!slug) {
    return NextResponse.json({ success: false, error: "Missing page slug" }, { status: 400 });
  }

  try {
    // 1. Connect to the database
    await connectToDatabase();

    // 2. Parse the request body (the full PageDocument)
    const pageData: PageDocument = await request.json();

    // 3. Find the document by slug and update it entirely
    const updatedPage = await Page.findOneAndUpdate(
      { slug: slug },
      { 
        $set: { 
          sections: pageData.sections,
          page_title: pageData.page_title,
          // Add any other top-level fields you want to update
          updatedAt: new Date(),
        } 
      },
      { new: true, runValidators: true } // 'new: true' returns the updated document
    ).exec();

    if (!updatedPage) {
      return NextResponse.json({ success: false, error: `Page with slug '${slug}' not found.` }, { status: 404 });
    }

    // 4. Return the updated document to the client
    // Use JSON.parse(JSON.stringify(updatedPage)) to ensure it's a plain JavaScript object
    const resultData = JSON.parse(JSON.stringify(updatedPage));

    return NextResponse.json({ success: true, data: resultData }, { status: 200 });

  } catch (error) {
    console.error("Error updating page content:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message || "Failed to update page content." },
      { status: 500 }
    );
  }
}