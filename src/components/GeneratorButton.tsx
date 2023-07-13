import download from "downloadjs";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import certificatePath from "../assets/certificate_template.pdf";

interface GeneratorButtonProps {
  selectedPerson: Person;
}

export const GeneratorButton = (props: GeneratorButtonProps) => {
  const { selectedPerson: selectedProject } = props;

  const NAME_FONT_SIZE = 32;
  const CPF_FONT_SIZE = 18;
  const TEXT_MAX_WIDTH = 620;
  const TEXT_COLOR = rgb(0.208, 0.635, 0.271);

  const downloadCertificates = async () => {
    const certificateTemplate = await fetch(certificatePath).then((res) =>
      res.arrayBuffer()
    );

    const pdf = await PDFDocument.load(certificateTemplate);
    const font = await pdf.embedFont(StandardFonts.Helvetica);

    const pdfPage = pdf.getPages()?.[0];
    const { width: pdfWidth } = pdfPage.getSize();

    const studentName = selectedProject?.name;

    let studentFontSize = NAME_FONT_SIZE + 1;
    let studentBoxWidth: number;
    do {
      studentFontSize -= 1;
      studentBoxWidth = font.widthOfTextAtSize(studentName, studentFontSize);
    } while (studentBoxWidth > TEXT_MAX_WIDTH);

    const studentBoxHeight = font.heightAtSize(studentFontSize);
    pdfPage.drawText(studentName, {
      y: 322.5 - studentBoxHeight / 2,
      size: studentFontSize,
      font,
      x: pdfWidth / 2 - studentBoxWidth / 2,
      color: TEXT_COLOR,
    });

    const { cpf } = selectedProject;
    const titleLineHeight = font.heightAtSize(CPF_FONT_SIZE);
    const titleLineWidth = font.widthOfTextAtSize(cpf, CPF_FONT_SIZE);

    pdfPage.drawText(cpf, {
      y: 279.5 - titleLineHeight / 2,
      size: CPF_FONT_SIZE,
      font,
      x: pdfWidth / 2 - titleLineWidth / 2 + 2,
      color: TEXT_COLOR,
    });

    const pdfTitle = [cpf, studentName].join(" - ");
    pdf.setTitle(pdfTitle);
    pdf.setLanguage("pt-br");
    pdf.setAuthor("Associação Brasileira de Incentivo à Ciência");
    pdf.setCreator("Gerador de Certificados - ABRIC");
    pdf.setProducer("Gerador de Certificados - ABRIC");
    pdf.setKeywords(["Ciência", "Tecnologia", "Certificado", "Prêmio"]);
    pdf.setSubject("Certificado");

    const pdfBytes = await pdf.save();
    download(pdfBytes, `${pdfTitle}.pdf`, "application/pdf");
  };

  return (
    <>
      <button
        className="bg-primary py-2 text-white font-bold mt-4"
        onClick={downloadCertificates}
      >
        BAIXAR CERTIFICADO de {selectedProject?.name}
      </button>
    </>
  );
};
