"use client";

import { useState, type FormEvent, type MouseEvent as ReactMouseEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Plus, Trash2, CheckCircle2 } from "lucide-react";

type Task = {
  id: string;
  text: string;
  done: boolean;
};

type Filter = "all" | "active" | "done";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  // posição normalizada do mouse (0–1) pra spotlight
  const [cursor, setCursor] = useState({ x: 0.5, y: 0.3 });

  function handleMouseMove(e: ReactMouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setCursor({ x, y });
  }

  function handleAddTask(e: FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const newTask: Task = {
      id: `${Date.now()}-${Math.random()}`,
      text: trimmed,
      done: false,
    };

    setTasks((prev) => [newTask, ...prev]);
    setInput("");
  }

  function toggleTask(id: string) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  }

  function deleteTask(id: string) {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }

  function clearCompleted() {
    setTasks((prev) => prev.filter((task) => !task.done));
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.done;
    if (filter === "done") return task.done;
    return true;
  });

  const activeCount = tasks.filter((t) => !t.done).length;
  const completedCount = tasks.filter((t) => t.done).length;
  const totalCount = tasks.length;
  const progress = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

  const spotlightStyle = {
    backgroundImage: `
      radial-gradient(
        circle at ${cursor.x * 100}% ${cursor.y * 100}%,
        rgba(45, 253, 177, 0.25),
        transparent 55%
      )
    `,
  };

  return (
    <main
      onMouseMove={handleMouseMove}
      className="relative min-h-screen bg-[#02030b] text-white flex items-center justify-center px-4 overflow-hidden"
    >
      {/* GRID ANIMADO */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.10),_transparent_60%),radial-gradient(circle_at_bottom,_rgba(16,185,129,0.10),_transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:80px_80px]" />
      </div>

      {/* SPOTLIGHT QUE SEGUE O MOUSE */}
      <motion.div
        style={spotlightStyle as any}
        className="pointer-events-none absolute inset-0 mix-blend-screen"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* BLOBS */}
      <motion.div
        className="pointer-events-none absolute -top-32 -left-20 w-72 h-72 rounded-full bg-emerald-500/25 blur-3xl"
        animate={{ y: [0, 16, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -bottom-40 -right-10 w-80 h-80 rounded-full bg-sky-500/25 blur-3xl"
        animate={{ y: [0, -18, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* CARD PRINCIPAL */}
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-xl relative"
      >
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative backdrop-blur-2xl bg-white/5 border border-white/10 rounded-3xl shadow-[0_22px_80px_rgba(0,0,0,0.85)] p-6 md:p-8 space-y-6 overflow-hidden"
        >
          {/* borda com glow */}
          <div className="pointer-events-none absolute inset-0 rounded-3xl border border-emerald-300/30/60 [mask-image:linear-gradient(to_bottom,_transparent,_black,_transparent)]" />
          {/* linha de luz passando */}
          <motion.div
            className="pointer-events-none absolute -inset-x-40 -top-1 h-px bg-gradient-to-r from-transparent via-emerald-300/80 to-transparent"
            animate={{ x: ["0%", "50%", "-50%", "0%"] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />

          {/* HEADER */}
          <header className="flex items-start justify-between gap-4 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 text-[11px] text-emerald-200/80 mb-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-300" />
                </span>
                <span>Seu hub de foco diário</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
                Focus Tasks
              </h1>
              <p className="text-sm text-neutral-300 mt-1">
                Organize o resto do seu dia em minutos, não em horas.
              </p>
            </div>

            <motion.span
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-[0.65rem] md:text-xs uppercase tracking-[0.25em] text-emerald-300/90 bg-emerald-300/10 px-3 py-1 rounded-full shadow-inner border border-emerald-300/40"
            >
              React · Next
            </motion.span>
          </header>

          {/* PROGRESS BAR */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            className="relative z-10 space-y-1"
          >
            <div className="flex items-center justify-between text-[11px] text-neutral-300">
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                {totalCount === 0 ? (
                  <span>Nenhuma tarefa ainda</span>
                ) : (
                  <span>
                    {completedCount} de {totalCount} concluídas
                  </span>
                )}
              </span>
              <span className="font-medium text-emerald-300">{progress}% foco</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-emerald-300 via-cyan-300 to-sky-400"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ type: "spring", stiffness: 90, damping: 18 }}
              />
            </div>
          </motion.div>

          {/* INPUT + BOTÃO */}
          <motion.form
            onSubmit={handleAddTask}
            className="flex gap-2 items-center relative z-10 pt-2"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <div className="relative flex-1 group">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-300/0 via-emerald-300/15 to-sky-400/0 opacity-0 group-focus-within:opacity-100 transition-opacity" />
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Adicionar nova tarefa..."
                className="relative w-full rounded-2xl bg-black/50 border border-white/15 px-4 py-3 text-sm md:text-base outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/40 transition placeholder:text-neutral-500"
              />
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.04 }}
              type="submit"
              className="shrink-0 px-4 md:px-5 py-3 rounded-2xl bg-emerald-400 text-black font-medium text-sm md:text-base hover:bg-emerald-300 active:scale-[0.98] transition inline-flex items-center gap-2 shadow-lg shadow-emerald-500/40"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar</span>
            </motion.button>
          </motion.form>

          {/* FILTROS + INFO */}
          <motion.div
            className="flex flex-wrap items-center justify-between gap-3 text-xs md:text-sm relative z-10"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex gap-2">
              <FilterChip
                label="Todas"
                active={filter === "all"}
                onClick={() => setFilter("all")}
              />
              <FilterChip
                label="Ativas"
                active={filter === "active"}
                onClick={() => setFilter("active")}
              />
              <FilterChip
                label="Concluídas"
                active={filter === "done"}
                onClick={() => setFilter("done")}
              />
            </div>

            <div className="flex items-center gap-3 text-neutral-300">
              <span className="text-xs md:text-sm">
                <strong className="text-emerald-300">{activeCount}</strong>{" "}
                restante(s)
              </span>
              {tasks.some((t) => t.done) && (
                <button
                  type="button"
                  onClick={clearCompleted}
                  className="inline-flex items-center gap-1 text-xs md:text-sm text-neutral-300 hover:text-emerald-200 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Limpar concluídas</span>
                </button>
              )}
            </div>
          </motion.div>

          {/* LISTA DE TASKS */}
          <section className="space-y-2 max-h-80 overflow-y-auto pr-1 relative z-10">
            {filteredTasks.length === 0 && (
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.32 }}
                className="text-sm text-neutral-400 text-center py-8 flex flex-col items-center gap-1"
              >
                <Sparkles className="w-4 h-4 text-emerald-300" />
                <span>Sem tarefas por aqui ainda.</span>
                <span>Comece adicionando uma acima. ✨</span>
              </motion.p>
            )}

            <AnimatePresence initial={false}>
              {filteredTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={() => toggleTask(task.id)}
                  onDelete={() => deleteTask(task.id)}
                />
              ))}
            </AnimatePresence>
          </section>
        </motion.div>

        {/* CRÉDITO */}
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 0.8, y: 0 }}
          transition={{ delay: 0.35 }}
          className="text-[11px] text-neutral-500 text-center mt-4"
        >
          Construído em React/Next por você 💻
        </motion.p>
      </motion.div>
    </main>
  );
}

/* ----------------- COMPONENTES AUXILIARES ----------------- */

type FilterChipProps = {
  label: string;
  active: boolean;
  onClick: () => void;
};

function FilterChip({ label, active, onClick }: FilterChipProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.94 }}
      whileHover={{ y: -1 }}
      className={`px-3 py-1 rounded-full border text-xs md:text-sm transition inline-flex items-center gap-1 ${
        active
          ? "bg-emerald-300 text-black border-emerald-300 shadow shadow-emerald-400/40"
          : "border-white/15 text-neutral-300 hover:border-emerald-200 hover:text-emerald-100"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          active ? "bg-emerald-700" : "bg-neutral-500"
        }`}
      />
      {label}
    </motion.button>
  );
}

type TaskItemProps = {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
};

function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.96 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-3 bg-white/6 rounded-2xl px-4 py-3 border border-white/5 hover:border-emerald-300/60 hover:bg-white/10 transition group"
    >
      <button
        type="button"
        onClick={onToggle}
        className={`w-5 h-5 rounded-full border flex items-center justify-center transition ${
          task.done
            ? "border-emerald-300 bg-emerald-300"
            : "border-white/30 bg-black/30 group-hover:border-emerald-200"
        }`}
      >
        {task.done && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.15 }}
            className="text-[10px] text-black font-bold"
          >
            ✓
          </motion.span>
        )}
      </button>

      <p
        className={`flex-1 text-sm md:text-base ${
          task.done ? "line-through text-neutral-400" : "text-neutral-50"
        }`}
      >
        {task.text}
      </p>

      <button
        type="button"
        onClick={onDelete}
        className="text-xs text-neutral-400 hover:text-red-300 transition inline-flex items-center gap-1 opacity-0 group-hover:opacity-100"
      >
        <Trash2 className="w-3.5 h-3.5" />
        <span>excluir</span>
      </button>
    </motion.article>
  );
}
