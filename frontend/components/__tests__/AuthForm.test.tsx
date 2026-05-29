import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const push = vi.fn();
const refresh = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push, refresh }) }));

const login = vi.fn();
vi.mock("@/lib/client-api", () => ({
  login: (...args: unknown[]) => login(...args),
  registerUser: vi.fn(),
}));

import { AuthForm } from "@/components/auth/AuthForm";

describe("AuthForm", () => {
  beforeEach(() => {
    push.mockReset();
    login.mockReset();
  });

  it("submits credentials and navigates to the board on success", async () => {
    login.mockResolvedValue({ ok: true, json: async () => ({}) });
    const user = userEvent.setup();
    render(<AuthForm mode="login" />);
    await user.type(screen.getByLabelText("Username"), "demo");
    await user.type(screen.getByLabelText("Password"), "demo12345");
    await user.click(screen.getByRole("button", { name: /sign in/i }));
    expect(login).toHaveBeenCalledWith("demo", "demo12345");
    expect(push).toHaveBeenCalledWith("/board");
  });
});
