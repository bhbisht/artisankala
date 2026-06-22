"use client";

import { useState } from "react";
import ThemeToggle from "../../components/ThemeToggle";

import {
  Button,
  Input,
  Modal,
  Toast,
  Loader,
} from "../../components/ui";

export default function ShowcasePage() {
  const [inputValue, setInputValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  return (
    <div className="p-8 space-y-8 min-h-screen">
      <h1 className="text-4xl font-bold">
        UI Component Showcase
      </h1>

      <ThemeToggle />

      {/* Buttons */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">
          Buttons
        </h2>

        <div className="flex gap-4 flex-wrap">
          <Button variant="primary">
            Primary
          </Button>

          <Button variant="secondary">
            Secondary
          </Button>

          <Button variant="outline">
            Outline
          </Button>

          <Button disabled>
            Disabled
          </Button>
        </div>
      </section>

      {/* Input */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">
          Input
        </h2>

        <Input
          label="Name"
          placeholder="Enter your name"
          value={inputValue}
          onChange={(e) =>
            setInputValue(e.target.value)
          }
          error={
            inputValue === ""
              ? "This field is required"
              : ""
          }
        />
      </section>

      {/* Modal */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">
          Modal
        </h2>

        <Button
          onClick={() => setIsModalOpen(true)}
        >
          Open Modal
        </Button>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Sample Modal"
        >
          <p>
            This is a reusable modal component.
          </p>
        </Modal>
      </section>

      {/* Toast */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">
          Toast
        </h2>

        <Button
          onClick={() => setShowToast(true)}
        >
          Show Toast
        </Button>

        <Toast
          message="Action completed successfully!"
          show={showToast}
          onClose={() => setShowToast(false)}
        />
      </section>

      {/* Loader */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">
          Loader
        </h2>

        <Loader />
      </section>
    </div>
  );
}