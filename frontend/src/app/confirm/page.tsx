"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Atoms/Header";
import Schedule from "@/components/Atoms/Schedule";
import ScheduleTransportation from "@/components/Atoms/ScheculeTransportation";
import { Button } from "@/components/ui/button";
import CurrentTimeLine from "@/components/Atoms/currentTineLine";
import Alert from "@/components/Molecules/Alert";

interface ScheduleData {
  id: string;
  start_point: {
    id: string;
    location: string;
    departure_datetime: string;
    travel_method_to_next: string;
  };
  final_point: {
    id: string;
    location: string;
    arrival_datetime: string;
  };
  via_points: {
    index: number;
    plan: string;
    location: string;
    arrival_datetime: string;
    priority: string;
    departure_datetime: string;
    travel_method_to_next: string;
  }[];
  plan_name: string;
}

export default function ConfirmPage() {
  const searchParams = useSearchParams();
  const uuid = searchParams.get("uuid");

  const [activeSchedule, setActiveSchedule] = useState<string | null>(null);
  const [timeLineColor, setTimeLineColor] = useState<"green" | "red">("green");
  const [scheduleData, setScheduleData] = useState<ScheduleData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [showAlert, setShowAlert] = useState<boolean>(false);

  // マウント時に10分ごとに現在時刻を更新するタイマーをセット
  useEffect(() => {
    const timerId = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      updateTimeLineColor();
    }, 10 * 60 * 1000);
    return () => clearInterval(timerId);
  }, []);

  // uuid がある場合にスケジュールデータを取得
  useEffect(() => {
    if (uuid) {
      fetchScheduleData(uuid);
    }
  }, [uuid]);

  const fetchScheduleData = async (uuid: string) => {
    try {
      const response = await fetch(
        `https://two025-tabinosuke-dev.onrender.com/api/load/${uuid}/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: ScheduleData = await response.json();
      setScheduleData(data);
      setError(null);
      updateTimeLineColor(data);
    } catch (error) {
      console.error("データの取得に失敗しました", error);
      setError("データの取得に失敗しました。UUIDを確認してください。");
    }
  };

  const updateTimeLineColor = (data?: ScheduleData) => {
    const schedule = data || scheduleData;
    if (!schedule) return;
    if (new Date(schedule.start_point.departure_datetime) > currentTime) {
      setTimeLineColor("red");
    } else {
      setTimeLineColor("green");
    }
  };

  const handleScheduleClick = (scheduleId: string) => {
    setActiveSchedule(scheduleId);
    updateTimeLineColor();
  };

  // シェアボタンがクリックされたとき、URL をクリップボードにコピー
  const handleShareClick = () => {
    if (!uuid) return;
    const shareUrl = `https://tabinosuke-app-test.vercel.app/confirm?uuid=${uuid}/`;
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        alert("URLがコピーされました！");
      })
      .catch((err) => {
        console.error("URLのコピーに失敗しました: ", err);
      });
  };

  // alertTest 関数：Alert ポップアップを表示する
  const alertTest = () => {
    setShowAlert(true);
  };

  // Alert のキャンセル時（閉じる）ハンドラ
  const handleAlertClose = () => {
    setShowAlert(false);
  };

  const formatDateToISOString = (date: Date) => {
    const pad = (num: number) => String(num).padStart(2, "0");
    const year = date.getUTCFullYear();
    const month = pad(date.getUTCMonth() + 1);
    const day = pad(date.getUTCDate());
    const hours = pad(date.getUTCHours());
    const minutes = pad(date.getUTCMinutes());
    const seconds = pad(date.getUTCSeconds());
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };

  const getPassedIndex = (): number => {
    if (!scheduleData) return -1;
    const items: { index: number; time: Date }[] = [];
    // start_point を index 0 とする
    items.push({
      index: 0,
      time: new Date(scheduleData.start_point.departure_datetime),
    });
    // via_points は index 1～（順番通り）
    scheduleData.via_points.forEach((point, idx) => {
      items.push({
        index: idx + 1,
        time: new Date(point.arrival_datetime),
      });
    });
    // final_point は最後の index（items.length）
    items.push({
      index: items.length,
      time: new Date(scheduleData.final_point.arrival_datetime),
    });
    // 現在時刻よりも後の最初のアイテムを探す
    for (let i = 0; i < items.length; i++) {
      if (currentTime < items[i].time) {
        // i が0なら現在時刻より前の項目がないので、0を返す
        return i - 1 >= 0 ? items[i - 1].index : 0;
      }
    }
    // すべて過ぎている場合は最後の index を返す
    return items[items.length - 1].index;
  };

  // Alert の確認時ハンドラ：POST してレスポンスの id を参照し、指定の URL を開く
  const handleAlertConfirm = async () => {
    if (!uuid) return;
    try {
      const nowIso = formatDateToISOString(new Date());
      const passedIndex = getPassedIndex();
      const payload = {
        id: uuid,
        now_time: nowIso,
        delete: false,
        passed_index: passedIndex,
      };
      const response = await fetch(
        "https://two025-tabinosuke-dev.onrender.com/api/schedule-adjust/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      const newId = result.id;
      window.location.href = `http://localhost:3001/confirm?uuid=${newId}`;
    } catch (error) {
      console.error("POST schedule-adjust エラー:", error);
      setError("スケジュールの調整に失敗しました。");
    } finally {
      setShowAlert(false);
    }
  };

  if (!scheduleData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        {error && <div className="text-red-500">{error}</div>}
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex justify-center items-center bg-gray-100 relative">
      <div className="w-full max-w-[585.6px] mx-auto bg-white shadow-md rounded-lg px-8 py-6 gap-8">
        <Header text="スケジュール確認" />
        <div className="flex flex-col gap-11 items-center">
          <div onClick={() => handleScheduleClick("schedule1")}>
            <Schedule
              departure_datetime={new Date(
                scheduleData.start_point.departure_datetime,
              )}
              route={scheduleData.start_point.location}
              priority="低"
              showCurrent={activeSchedule === "schedule1"}
              showPriority={false}
            />
          </div>
          <ScheduleTransportation
            transport={scheduleData.start_point.travel_method_to_next}
          />
          <CurrentTimeLine lineColor={timeLineColor} />
          {scheduleData.via_points.map((point, index) => (
            <React.Fragment key={point.index}>
              <div onClick={() => handleScheduleClick(`schedule${index + 2}`)}>
                <Schedule
                  arrival_datetime={new Date(point.arrival_datetime)}
                  departure_datetime={new Date(point.departure_datetime)}
                  priority={point.priority as "低" | "中" | "高"}
                  route={point.location}
                  showCurrent={activeSchedule === `schedule${index + 2}`}
                  showPriority={true}
                />
              </div>
              <ScheduleTransportation
                transport={point.travel_method_to_next}
              />
            </React.Fragment>
          ))}
          <div onClick={() => handleScheduleClick("scheduleFinal")}>
            <Schedule
              arrival_datetime={new Date(
                scheduleData.final_point.arrival_datetime,
              )}
              route={scheduleData.final_point.location}
              priority="低"
              showCurrent={activeSchedule === "scheduleFinal"}
              showPriority={false}
            />
          </div>
        </div>
        <div className="p-4 flex flex-row gap-10">
          <Button variant="outline" className="w-[136px]">
            修正する
          </Button>
          <Button
            className="w-[136px] bg-[#3f3f46]"
            onClick={handleShareClick}
          >
            シェアする
          </Button>
        </div>
        <div className="mt-4">
          <Button
            className="w-[136px] bg-[#3f3f46]"
            onClick={alertTest}
          >
            アラートテスト
          </Button>
        </div>
      </div>
      {/* Alert をポップアップ表示するオーバーレイ */}
      {showAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Alert onClose={handleAlertClose} onConfirm={handleAlertConfirm} />
        </div>
      )}
    </main>
  );
}
