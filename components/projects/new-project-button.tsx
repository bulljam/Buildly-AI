import { Button } from "@/components/ui/button"

type NewProjectButtonProps = {
  action: () => Promise<void>
  disabled?: boolean
}

export function NewProjectButton({
  action,
  disabled = false,
}: NewProjectButtonProps) {
  return (
    <form action={action}>
      <Button
        type="submit"
        size="lg"
        className="rounded-full px-6"
        disabled={disabled}
      >
        {disabled ? "Configure database first" : "New project"}
      </Button>
    </form>
  )
}
