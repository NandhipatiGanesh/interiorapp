// app/_app.tsx
import { Slot } from "expo-router";
// 👇 Correct path (since your file is inside /app/hooks)
import { AuthProvider } from "@/hooks/useAuth";

export default function App() {
  return (
    <AuthProvider>
      <Slot /> {/* renders layouts and screens */}
    </AuthProvider>
  );
}
