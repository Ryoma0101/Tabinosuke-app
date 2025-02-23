import { Input } from "../components/Atoms/Input/input";

export default function Home() {
  return (
    <div className="grid flex justify-center align-center">
      <Input type="text" placeholder="旅行プラン名" />
    </div>
  );
}
