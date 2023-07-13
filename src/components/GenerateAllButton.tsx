import download from "downloadjs";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import certificatePath from "../assets/certificate_template.pdf";
import { useMemo } from "react";

interface GenerateAllButtonProps {
  people: Person[];
}

export const GenerateAllButton = (props: GenerateAllButtonProps) => {
  const { people } = props;

  // TODO: implement memo for calculating cpf measurements (will always be the same for every certificate)
  // const cpfLineHeight = useMemo();
  // const cpfLineWidth = useMemo();

  const NAME_FONT_SIZE = 32;
  const CPF_FONT_SIZE = 18;
  const TEXT_MAX_WIDTH = 620;
  const TEXT_COLOR = rgb(0.208, 0.635, 0.271);

  const downloadCertificates = async () => {
    const certificateTemplate = await fetch(certificatePath).then((res) =>
      res.arrayBuffer()
    );

    people?.forEach(async (person) => {
      const { cpf, name } = person;

      const pdf = await PDFDocument.load(certificateTemplate);

      // TODO: change to Roboto
      const font = await pdf.embedFont(StandardFonts.Helvetica);

      const pdfPage = pdf.getPages()?.[0];
      const { width: pdfWidth } = pdfPage.getSize();

      let studentFontSize = NAME_FONT_SIZE + 1;
      let nameTextWidth: number;
      do {
        studentFontSize -= 1;
        nameTextWidth = font.widthOfTextAtSize(name, studentFontSize);
      } while (nameTextWidth > TEXT_MAX_WIDTH);

      const nameTextHeight = font.heightAtSize(studentFontSize);
      pdfPage.drawText(name, {
        y: 322.5 - nameTextHeight / 2,
        size: studentFontSize,
        font,
        x: pdfWidth / 2 - nameTextWidth / 2,
        color: TEXT_COLOR,
      });

      // TODO: useMemo
      const cpfLineHeight = font.heightAtSize(CPF_FONT_SIZE);
      const cpfLineWidth = font.widthOfTextAtSize(cpf, CPF_FONT_SIZE);

      pdfPage.drawText(cpf, {
        y: 279.5 - cpfLineHeight / 2,
        size: CPF_FONT_SIZE,
        font,
        x: pdfWidth / 2 - cpfLineWidth / 2 + 2,
        color: TEXT_COLOR,
      });

      const pdfTitle = [cpf, name].join(" - ");
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
    <>
      <button
        className="bg-primary py-2 text-white font-bold mt-4"
        onClick={downloadCertificates}
      >
        BAIXAR <span className="font-bold">TODOS</span> OS CERTIFICADOS{" "}
        {people?.length}
      </button>
    </>
  );
};
