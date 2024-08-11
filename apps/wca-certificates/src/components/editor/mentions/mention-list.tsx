/* eslint-disable react/no-array-index-key -- . */
/* eslint-disable @typescript-eslint/no-explicit-any -- . */
/* eslint-disable @typescript-eslint/no-unsafe-assignment -- . */
/* eslint-disable @typescript-eslint/no-unsafe-member-access -- . */
/* eslint-disable react/display-name -- . */
/* eslint-disable @typescript-eslint/no-unsafe-call -- . */
/* eslint-disable react/button-has-type -- . */
/* eslint-disable @typescript-eslint/explicit-function-return-type -- . */
import { usePathname } from "next/navigation";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

export const MentionList = forwardRef((props: any, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const pathname = usePathname();
  const lang = pathname.startsWith("/es") ? "es" : "en";

  const selectItem = (index: number) => {
    const item = props.items[index];

    if (item) {
      props.command({ id: item });
    }
  };

  const upHandler = () => {
    setSelectedIndex(
      (selectedIndex + props.items.length - 1) % props.items.length,
    );
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useEffect(() => {
    setSelectedIndex(0);
  }, [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: any) => {
      if (event.key === "ArrowUp") {
        upHandler();
        return true;
      }

      if (event.key === "ArrowDown") {
        downHandler();
        return true;
      }

      if (event.key === "Enter") {
        enterHandler();
        return true;
      }

      return false;
    },
  }));

  return (
    <div className="bg-background rounded border flex flex-col">
      {props.items.length ? (
        props.items.map((item: any, index: number) => (
          <button
            className={`py-1 px-4 hover:bg-muted ${index === selectedIndex ? "bg-muted" : ""}`}
            key={index}
            onClick={() => {
              selectItem(index);
            }}
          >
            {item}
          </button>
        ))
      ) : (
        <div className="py-1 px-4 italic">
          {lang === "es" ? "Sin resultados" : "No results"}
        </div>
      )}
    </div>
  );
});
