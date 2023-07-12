import download from "downloadjs";
import { PDFDocument, PDFFont, StandardFonts, rgb } from "pdf-lib";
import certificatePath from "../assets/premio_abric_incentivo_ciencia.pdf";

interface GeneratorButtonProps {
  selectedProject: Project;
}

export const GeneratorButton = (props: GeneratorButtonProps) => {
  const { selectedProject } = props;

  const DEFAULT_FONT_SIZE = 20;
  const TEXT_MAX_WIDTH = 550;
  const TITLE_MAX_HEIGHT = 85;
  const TEXT_COLOR = rgb(0.208, 0.635, 0.271);

  function wrapText(
    text: string,
    font: PDFFont,
    fontSize: number,
    maxWidth: number,
    maxHeight: number
  ): string[] {
    const words = text.split(" ");
    let line = "";
    let result = "";
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const testWidth = font.widthOfTextAtSize(testLine, fontSize);
      if (testWidth > maxWidth) {
        result += line + "\n";
        line = words[n] + " ";
      } else {
        line = testLine;
      }
    }
    result += line;

    const paragraphs = result.split("\n");

    font.heightAtSize(fontSize);

    if (paragraphs.length * font.heightAtSize(fontSize) > maxHeight)
      return wrapText(text, font, fontSize - 1, maxWidth, maxHeight);
    else return paragraphs;
  }

  const downloadCertificates = async () => {
    const certificateTemplate = await fetch(certificatePath).then((res) =>
      res.arrayBuffer()
    );

    selectedProject.authors?.forEach(async (author) => {
      const pdf = await PDFDocument.load(certificateTemplate);
      const font = await pdf.embedFont(StandardFonts.HelveticaBold);

      const pdfPage = pdf.getPages()?.[0];
      const { width: pdfWidth } = pdfPage.getSize();

      const studentName = author.name;

      let studentFontSize = DEFAULT_FONT_SIZE + 1;
      let studentBoxWidth: number;
      do {
        studentFontSize -= 1;
        studentBoxWidth = font.widthOfTextAtSize(studentName, studentFontSize);
      } while (studentBoxWidth > TEXT_MAX_WIDTH);

      const studentBoxHeight = font.heightAtSize(studentFontSize);
      pdfPage.drawText(studentName, {
        y: 250 - studentBoxHeight / 2,
        size: studentFontSize,
        font,
        x: pdfWidth / 2 - studentBoxWidth / 2,
        color: TEXT_COLOR,
      });

      const projectTitle = selectedProject.title;
      let titleFontSize = DEFAULT_FONT_SIZE + 1;
      let lines: string[];
      let titleLineHeight: number;

      do {
        titleFontSize -= 1;
        titleLineHeight = font.heightAtSize(titleFontSize);
        lines = wrapText(
          projectTitle,
          font,
          titleFontSize,
          TEXT_MAX_WIDTH,
          TITLE_MAX_HEIGHT
        );
      } while (lines.length * titleLineHeight > TITLE_MAX_HEIGHT);

      const wrapedTitleFinalHeight = lines.length * titleLineHeight;
      lines.forEach((line, index) => {
        const titleLineWidth = font.widthOfTextAtSize(line, titleFontSize);

        pdfPage.drawText(line, {
          y:
            200 -
            (TITLE_MAX_HEIGHT - wrapedTitleFinalHeight) / 2 -
            index * titleLineHeight,
          size: titleFontSize,
          font,
          x: pdfWidth / 2 - titleLineWidth / 2,
          color: TEXT_COLOR,
        });
      });

      const pdfTitle = [projectTitle, studentName].join(" - ");
      pdf.setTitle(pdfTitle);
      pdf.setLanguage("pt-br");
      pdf.setAuthor("Associação Brasileira de Incentivo à Ciência");
      pdf.setCreator("Gerador de Certificados - ABRIC");
      pdf.setProducer("Gerador de Certificados - ABRIC");
      pdf.setKeywords(["Ciência", "Tecnologia", "Certificado", "Prêmio"]);
      pdf.setSubject("Certificado");

      const pdfBytes = await pdf.save();
      download(pdfBytes, `${pdfTitle}.pdf`, "application/pdf");
    });
  };

  return (
    <button
      className="bg-primary py-2 text-white font-bold mt-4"
      onClick={downloadCertificates}
    >
      BAIXAR CERTIFICADO{selectedProject?.authors?.length > 1 && "(S)"}
    </button>
  );
};
