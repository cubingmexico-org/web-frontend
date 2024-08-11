/* eslint-disable @typescript-eslint/no-unsafe-return -- . */
/* eslint-disable @typescript-eslint/no-unsafe-assignment -- . */
/* eslint-disable @typescript-eslint/no-explicit-any -- . */
/* eslint-disable @typescript-eslint/no-unsafe-member-access -- . */
/* eslint-disable @typescript-eslint/no-unsafe-call -- . */
/* eslint-disable @typescript-eslint/no-unsafe-argument -- . */
import { ReactRenderer } from "@tiptap/react";
import tippy from "tippy.js";
import { MentionList } from "../../mention-list";

export default {
  items: ({ query }: any) => {
    return [
      "Delegates",
      "Organizers",
      "Competitor",
      "Competition",
      "Date",
      "City",
      "Event (table)",
      "Result (table)",
      "Ranking (table)",
    ].filter((item) => item.toLowerCase().startsWith(query.toLowerCase()));
  },

  render: () => {
    let reactRenderer: any;
    let popup: any;

    return {
      onStart: (props: { clientRect: any; editor: any }) => {
        if (!props.clientRect) {
          return;
        }

        reactRenderer = new ReactRenderer(MentionList, {
          props,
          editor: props.editor,
        });

        popup = tippy("body", {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: reactRenderer.element,
          showOnCreate: true,
          interactive: true,
          trigger: "manual",
          placement: "bottom-start",
        });
      },

      onUpdate(props: { clientRect: any }) {
        reactRenderer.updateProps(props);

        if (!props.clientRect) {
          return;
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        });
      },

      onKeyDown(props: { event: { key: string } }) {
        if (props.event.key === "Escape") {
          popup[0].hide();

          return true;
        }

        return reactRenderer.ref?.onKeyDown(props);
      },

      onExit() {
        popup[0].destroy();
        reactRenderer.destroy();
      },
    };
  },
} as any;
