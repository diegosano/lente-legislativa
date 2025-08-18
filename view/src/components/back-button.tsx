import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "@tanstack/react-router";

export function BackButton() {
  const router = useRouter();

  return (
    <Button type="button" variant="ghost" onClick={() => router.navigate({ to: "/" })} className="mb-6 -ml-4 cursor-pointer">
      <ArrowLeft className="h-4 w-4 mr-2" />
      Voltar
    </Button>
  );
}
