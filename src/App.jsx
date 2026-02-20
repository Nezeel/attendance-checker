import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { CalendarCheck, AlertTriangle, TrendingUp, Sparkles } from "lucide-react";

export default function App() {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const smoothRotateX = useSpring(rotateX, { stiffness: 60, damping: 20, mass: 0.8 });
  const smoothRotateY = useSpring(rotateY, { stiffness: 60, damping: 20, mass: 0.8 });
  const [totalClasses, setTotalClasses] = useState("");
  const [presentClasses, setPresentClasses] = useState("");
  const [criteria, setCriteria] = useState("75");
  const [result, setResult] = useState(null);

  const calculateAttendance = () => {
    const total = Number(totalClasses);
    const present = Number(presentClasses);
    const requiredPercentage = Number(criteria);

    if (total <= 0 || present < 0 || present > total) {
      setResult({ error: "Please enter valid class numbers." });
      return;
    }

    const currentPercentage = (present / total) * 100;

    if (currentPercentage >= requiredPercentage) {
      let bunk = 0;
      while ((present / (total + bunk)) * 100 >= requiredPercentage) {
        bunk++;
      }
      bunk--;

      setResult({
        status: "safe",
        message: `You can bunk ${bunk} more classes 😎`,
        percentage: currentPercentage.toFixed(2),
      });
    } else {
      let attend = 0;
      while (
        ((present + attend) / (total + attend)) * 100 <
        requiredPercentage
      ) {
        attend++;
      }

      setResult({
        status: "danger",
        message: `You need to attend ${attend} more classes 📚`,
        percentage: currentPercentage.toFixed(2),
      });
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-6">
      {/* Animated Background Blobs */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 6 }}
        className="absolute -top-20 -left-20 w-72 h-72 bg-indigo-600 opacity-40 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 8 }}
        className="absolute -bottom-20 -right-20 w-72 h-72 bg-fuchsia-600 opacity-40 rounded-full blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
        style={{
          rotateX: smoothRotateX,
          rotateY: smoothRotateY,
          transformPerspective: 1000,
        }}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const width = rect.width;
          const height = rect.height;

          const cornerThresholdX = width * 0.18;
          const cornerThresholdY = height * 0.18;

          const isCorner =
            (x < cornerThresholdX && y < cornerThresholdY) ||
            (x > width - cornerThresholdX && y < cornerThresholdY) ||
            (x < cornerThresholdX && y > height - cornerThresholdY) ||
            (x > width - cornerThresholdX && y > height - cornerThresholdY);

          if (!isCorner) {
            rotateX.set(0);
            rotateY.set(0);
            return;
          }

          const centerX = width / 2;
          const centerY = height / 2;
          const rotateXValue = ((y - centerY) / centerY) * 6;
          const rotateYValue = ((x - centerX) / centerX) * 6;

          rotateX.set(-rotateXValue);
          rotateY.set(rotateYValue);
        }}
        onMouseLeave={() => {
          rotateX.set(0);
          rotateY.set(0);
        }}
      >
        <Card className="rounded-3xl shadow-2xl backdrop-blur-xl bg-white/10 border border-white/20 border-0">
          <CardContent className="p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="flex justify-center gap-3">
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  className="p-3 bg-indigo-100 rounded-full shadow-md"
                >
                  <CalendarCheck className="w-6 h-6" />
                </motion.div>
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 4 }}
                  className="p-3 bg-pink-100 rounded-full shadow-md"
                >
                  <Sparkles className="w-6 h-6 text-pink-500" />
                </motion.div>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Attendance Tracker
              </h1>
              <p className="text-sm text-gray-300">
                Plan Smart. Bunk Smarter. Stay Legendary 😎🔥
              </p>
              <p className="text-xs text-indigo-300 font-medium tracking-wide">
                Track • Optimize • Dominate Your Attendance Game
              </p>
            </div>

            <div className="grid gap-4">
              <div>
                <label className="text-sm font-semibold text-indigo-200 tracking-wide">Total Classes</label>
                <Input
                  type="number"
                  value={totalClasses}
                  onChange={(e) => setTotalClasses(e.target.value)}
                  className="rounded-2xl mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-indigo-200 tracking-wide">Present Classes</label>
                <Input
                  type="number"
                  value={presentClasses}
                  onChange={(e) => setPresentClasses(e.target.value)}
                  className="rounded-2xl mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-indigo-200 tracking-wide">Attendance Criteria</label>
                <Select onValueChange={(value) => setCriteria(value)} defaultValue="75">
                  <SelectTrigger className="rounded-2xl mt-1 bg-white/10 border border-indigo-400/40 text-indigo-200 focus:ring-2 focus:ring-indigo-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border border-indigo-500/40 text-indigo-200">
                    {[65, 70, 75, 80, 85, 90].map((val) => (
                      <SelectItem
                        key={val}
                        value={val.toString()}
                        className="hover:bg-fuchsia-600/40 focus:bg-fuchsia-600/50 hover:text-white focus:text-white transition-colors duration-200 text-indigo-200"
                      >
                        {val}%
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              className="w-full rounded-2xl text-lg py-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-pink-500 hover:to-indigo-500 transition-all duration-500 shadow-lg hover:shadow-pink-500/50 hover:scale-105 border-0 text-white font-semibold tracking-wide"
              onClick={calculateAttendance}
            >
              <TrendingUp className="w-5 h-5 mr-2" /> Calculate
            </Button>

            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-5 rounded-3xl text-center text-sm font-medium shadow-md ${
                  result.status === "safe"
                    ? "bg-green-100 text-green-700"
                    : result.status === "danger"
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {result.error ? (
                  <div className="flex items-center justify-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    <p>{result.error}</p>
                  </div>
                ) : (
                  <>
                    <p className="font-semibold text-base">
                      Current Attendance: {result.percentage}%
                    </p>
                    <div className="relative flex items-center justify-center mt-4">
                      <div
                        className="w-24 h-24 rounded-full flex items-center justify-center text-lg font-bold"
                        style={{
                          background: `conic-gradient(${result.status === "safe" ? "#22c55e" : "#ef4444"} ${Number(result.percentage) * 3.6}deg, #e5e7eb 0deg)`,
                        }}
                      >
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-inner">
                          {result.percentage}%
                        </div>
                      </div>
                    </div>
                    <p className="mt-4 text-base">{result.message}</p>
                  </>
                )}
              </motion.div>
            )}

            <div className="pt-4 border-t border-white/20 text-center text-xs text-gray-400">
              Made with ❤️ by <span className="font-semibold">Nezeel Sonani</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
