import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";

export default function Page(): JSX.Element {
  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <h1 className="text-center text-4xl pb-4 font-semibold">
        Preguntas frecuentes
      </h1>
      <p className="text-center pb-2">
        A continuación se lista una serie de preguntas que le pudieran surgir a
        los usuarios promedio al momento de interactuar en el sitio:
      </p>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>
            ¿Por qué no aparezco como miembro del team de mi estado? :(
          </AccordionTrigger>
          <AccordionContent>
            Si no apareces como miembro de tu team estatal es porque no has
            participado en una competencia oficial de la World Cube Association
            o porque no has sido agregado por algún administrador, recuerda que
            todos pueden ser parte de un team, el único requisito es que vivas
            en el mismo estado, si cumples con lo anterior mencionado contáctate
            con el team en cuestión o a través de la página Facebook de Cubing
            México.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>
            ¿Por qué aparece tal persona en un team si ni siquiera vive en ese
            estado?
          </AccordionTrigger>
          <AccordionContent>
            Puede deberse a que la persona se cambió recientemente de residencia
            o simplemente a algún error del administrador de un team, puedes
            enviar un mensaje a alguna de sus redes sociales para que puedan
            revisarlo o reportarlo directamente a la página Facebook de Cubing
            México.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </main>
  );
}
