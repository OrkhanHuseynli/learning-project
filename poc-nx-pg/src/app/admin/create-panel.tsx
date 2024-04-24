"use client";

import { ItemCreateDialog } from "../../components/ui/ItemCreateDialog";
import { Button } from "../../components/ui/plate-ui/button";
import { Dialog } from "../../components/ui/plate-ui/dialog";

export function CreatePanel() {

  return (
    <div className="container mx-auto mt-20">
      {/* <Button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={create}
      >
        Create
      </Button> */}
      <ItemCreateDialog />
    </div>
  );
}
