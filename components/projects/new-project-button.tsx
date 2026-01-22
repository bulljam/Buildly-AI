import { Button } from "@/components/ui/button"

type NewProjectButtonProps = {
  action: () => Promise<void>
}

export function NewProjectButton({ action }: NewProjectButtonProps) {
  return (
    <form action={action}>
      <Button type="submit" size="lg" className="rounded-full px-6">
        New project
      </Button>
    </form>
  )
}
