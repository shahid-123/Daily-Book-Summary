import { jsPDF } from 'jspdf';
import { BookSummary } from '../types';

export function exportSummaryToPdf(summary: BookSummary): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // ~595.28 pt
  const pageHeight = doc.internal.pageSize.getHeight(); // ~841.89 pt
  const margin = 40;
  const contentWidth = pageWidth - margin * 2; // ~515.28 pt
  let y = margin;

  // Safe page-break helper that preserves top/bottom margins and adds headers
  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin - 20) {
      doc.addPage();
      y = margin + 15;
      drawHeaderAndFooter();
    }
  };

  const drawHeaderAndFooter = () => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(140, 140, 140);
    doc.text("Shahid's BookPulse — Daily Motivational Book Summary", margin, 25);
    
    const catText = (summary.category || 'SUMMARY').toUpperCase();
    doc.text(catText, pageWidth - margin, 25, { align: 'right' });

    // Bottom footer with page count
    const pageCount = (doc.internal as any).getNumberOfPages ? (doc.internal as any).getNumberOfPages() : 1;
    doc.text(`Page ${pageCount}`, pageWidth / 2, pageHeight - 20, { align: 'center' });
  };

  drawHeaderAndFooter();

  // 1. Header Title & Author Block
  // Ensure title wraps strictly within contentWidth with safe right margin
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(17, 24, 39); // gray-900

  const titleLines = doc.splitTextToSize(summary.title, contentWidth - 24);
  const titleHeight = titleLines.length * 24;

  // Accent bar height matches title lines + author subtitle
  const accentBarHeight = Math.max(45, titleHeight + 22);
  doc.setFillColor(217, 119, 6); // amber-600
  doc.rect(margin, y, 5, accentBarHeight, 'F');

  doc.text(titleLines, margin + 14, y + 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(100, 116, 139); // slate-500
  const subY = y + 18 + titleHeight + 2;
  const authorSubtext = `By ${summary.author}  •  ${summary.readTimeMinutes} Min Read  •  ${summary.category}`;
  const safeAuthorSubtext = doc.splitTextToSize(authorSubtext, contentWidth - 24);
  doc.text(safeAuthorSubtext, margin + 14, subY);

  y += accentBarHeight + 18;

  // 2. Motivational Hook Callout Box
  // Keep text comfortably padded: 14pt left, 14pt right inside the box
  doc.setFont('times', 'italic');
  doc.setFontSize(11);
  const innerHookWidth = contentWidth - 32;
  const hookLines = doc.splitTextToSize(`"${summary.hook}"`, innerHookWidth);
  const hookBoxHeight = hookLines.length * 15 + 22;

  checkPageBreak(hookBoxHeight + 15);

  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.roundedRect(margin, y, contentWidth, hookBoxHeight, 4, 4, 'FD');

  doc.setTextColor(51, 65, 85); // slate-700
  doc.text(hookLines, margin + 16, y + 17);

  y += hookBoxHeight + 20;

  // 3. Section 1: The Core Philosophy & Main Idea (Simple Plain English)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text('1. The Core Idea', margin, y);
  y += 16;

  doc.setFont('times', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(51, 65, 85);

  // Split thesis into clean paragraphs
  const rawParagraphs = summary.coreThesis.split('\n').filter((p) => p.trim().length > 0);
  for (const para of rawParagraphs) {
    const lines = doc.splitTextToSize(para.trim(), contentWidth);
    const paraHeight = lines.length * 14.5;
    checkPageBreak(paraHeight + 10);
    doc.text(lines, margin, y);
    y += paraHeight + 8;
  }
  y += 12;

  // 4. Section 2: Key Lessons & Simple Exercises
  checkPageBreak(50);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text('2. Key Lessons & Easy Action Steps', margin, y);
  y += 16;

  summary.keyTakeaways.forEach((item, index) => {
    const itemTitle = `${index + 1}. ${item.title}`;
    const titleLines = doc.splitTextToSize(itemTitle, contentWidth);
    const insightLines = doc.splitTextToSize(item.insight, contentWidth - 16);

    // Practical drill yellow box dimensions
    // Yellow box has width = contentWidth - 16, starts at margin + 8.
    // Inner text must have width contentWidth - 36 to guarantee 10pt padding on left AND right!
    const drillText = `Action Step: ${item.practicalDrill}`;
    const drillLines = doc.splitTextToSize(drillText, contentWidth - 38);
    const drillBoxHeight = drillLines.length * 13 + 14;

    const blockHeight = titleLines.length * 15 + insightLines.length * 14 + drillBoxHeight + 18;
    checkPageBreak(blockHeight);

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text(titleLines, margin, y);
    y += titleLines.length * 15;

    // Insight
    doc.setFont('times', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text(insightLines, margin + 8, y);
    y += insightLines.length * 14 + 5;

    // Action Step box (properly bounded with no right overflow)
    const boxX = margin + 8;
    const boxW = contentWidth - 16;
    doc.setFillColor(254, 243, 199); // amber-100
    doc.setDrawColor(251, 191, 36); // amber-400
    doc.roundedRect(boxX, y, boxW, drillBoxHeight, 3, 3, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(146, 64, 14); // amber-800
    doc.text(drillLines, boxX + 10, y + 12);

    y += drillBoxHeight + 14;
  });

  // 5. Section 3: Real-Life Story & Application
  // Compute text lengths first to accurately fit the grey card
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);

  const cardInnerWidth = contentWidth - 32; // 16pt padding on both left and right
  const storyTitleLines = doc.splitTextToSize(summary.realLifeExample.title, cardInnerWidth);
  
  // Clean up any double newlines in the story for smooth reading
  const storyClean = summary.realLifeExample.story.replace(/\n\s*\n/g, ' ');
  const storyLines = doc.splitTextToSize(storyClean, cardInnerWidth);
  const takeawayClean = `What this teaches us: ${summary.realLifeExample.takeawayLesson}`;
  const lessonLines = doc.splitTextToSize(takeawayClean, cardInnerWidth - 12);

  const cardPaddingTop = 16;
  const lessonBoxHeight = lessonLines.length * 12.5 + 14;
  const cardHeight =
    cardPaddingTop +
    storyTitleLines.length * 15 +
    8 +
    storyLines.length * 13.5 +
    12 +
    lessonBoxHeight +
    16;

  // If the whole card fits on the page, keep it together
  checkPageBreak(Math.min(cardHeight + 35, 300));

  doc.text('3. Real-Life Example & True Story', margin, y);
  y += 16;

  // Background Box
  doc.setFillColor(241, 245, 249); // slate-100
  doc.setDrawColor(203, 213, 225); // slate-300
  doc.roundedRect(margin, y, contentWidth, cardHeight, 4, 4, 'FD');

  const cardX = margin + 16;
  let insideY = y + cardPaddingTop;

  // Story Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text(storyTitleLines, cardX, insideY);
  insideY += storyTitleLines.length * 15 + 6;

  // Story text
  doc.setFont('times', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text(storyLines, cardX, insideY);
  insideY += storyLines.length * 13.5 + 10;

  // Lesson callout inside story box
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(cardX, insideY, cardInnerWidth, lessonBoxHeight, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(lessonLines, cardX + 8, insideY + 11);

  y += cardHeight + 18;

  // 6. Section 4: 60-Second Daily Habit Box
  const habitInnerWidth = contentWidth - 32;
  const habitText = `Small Daily Habit (60 seconds): ${summary.dailyMicroHabit}`;
  const habitLines = doc.splitTextToSize(habitText, habitInnerWidth);
  const habitBoxH = habitLines.length * 13.5 + 20;

  checkPageBreak(habitBoxH + 20);

  doc.setFillColor(236, 253, 245); // emerald-50
  doc.setDrawColor(167, 243, 208); // emerald-200
  doc.roundedRect(margin, y, contentWidth, habitBoxH, 4, 4, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(4, 120, 87); // emerald-700
  doc.text(habitLines, margin + 16, y + 15);

  y += habitBoxH + 18;

  // 7. Section 5: Memorable Quote
  const quoteInnerWidth = contentWidth - 36;
  const quoteText = `"${summary.memorableQuote.quote}"`;
  const quoteLines = doc.splitTextToSize(quoteText, quoteInnerWidth);
  const quoteAuthor = `— ${summary.author} (${summary.memorableQuote.context || 'Key Lesson'})`;
  const authorLines = doc.splitTextToSize(quoteAuthor, quoteInnerWidth);
  const quoteTotalH = quoteLines.length * 15 + authorLines.length * 12 + 20;

  checkPageBreak(quoteTotalH + 20);

  doc.setFont('times', 'italic');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(quoteLines, margin + 18, y);
  y += quoteLines.length * 15 + 4;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text(authorLines, margin + 18, y);
  y += authorLines.length * 12 + 14;

  // 8. Section 6: Action Checklist (if available)
  if (summary.actionChecklist && summary.actionChecklist.length > 0) {
    checkPageBreak(80);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text('Quick Action Checklist:', margin, y);
    y += 14;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(51, 65, 85);

    summary.actionChecklist.forEach((chk) => {
      const itemText = `[  ]  ${chk}`;
      const itemLines = doc.splitTextToSize(itemText, contentWidth - 10);
      checkPageBreak(itemLines.length * 13 + 5);
      doc.text(itemLines, margin + 6, y);
      y += itemLines.length * 13 + 3;
    });
  }

  // Save PDF with sanitized safe filename
  const sanitizedTitle = (summary.title || 'summary')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_');
  const filename = `${sanitizedTitle}_summary.pdf`;
  doc.save(filename);
}
