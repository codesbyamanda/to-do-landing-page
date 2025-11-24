"use client";

import { useState } from "react";

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

  function handleAddTask(e: React.FormEvent) {
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

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#060816] via-[#0C1B33] to-[#060816] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-xl">
        {/* Card */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl p-6 md:p-8 space-y-6">
          {/* Header */}
          <header className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
                Focus Tasks
              </h1>
              <p className="text-sm text-neutral-300 mt-1">
                Organize o resto do seu dia em poucos minutos.
              </p>
            </div>
            <span className="text-xs uppercase tracking-[0.2em] text-emerald-300/90 bg-emerald-300/10 px-3 py-1 rounded-full">
              React · Next
            </span>
          </header>

          {/* Input */}
          <form
            onSubmit={handleAddTask}
            className="flex gap-2 items-center"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Adicionar nova tarefa..."
              className="flex-1 rounded-2xl bg-black/30 border border-white/15 px-4 py-3 text-sm md:text-base outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/40 transition"
            />
            <button
              type="submit"
              className="shrink-0 px-4 md:px-5 py-3 rounded-2xl bg-emerald-400 text-black font-medium text-sm md:text-base hover:bg-emerald-300 active:scale-[0.98] transition"
            >
              Adicionar
            </button>
          </form>

          {/* Filtros */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs md:text-sm">
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
              <span>
                <strong>{activeCount}</strong> restante(s)
              </span>
              {tasks.some((t) => t.done) && (
                <button
                  type="button"
                  onClick={clearCompleted}
                  className="underline underline-offset-4 hover:text-emerald-300 transition"
                >
                  Limpar concluídas
                </button>
              )}
            </div>
          </div>

          {/* Lista */}
          <section className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {filteredTasks.length === 0 && (
              <p className="text-sm text-neutral-400 text-center py-6">
                Nenhuma tarefa aqui ainda. Comece adicionando uma acima. ✨
              </p>
            )}

            {filteredTasks.map((task) => (
              <article
                key={task.id}
                className="flex items-center gap-3 bg-white/5 rounded-2xl px-4 py-3 border border-white/5 hover:border-emerald-300/50 transition group"
              >
                <button
                  type="button"
                  onClick={() => toggleTask(task.id)}
                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition ${
                    task.done
                      ? "border-emerald-300 bg-emerald-300"
                      : "border-white/30 bg-black/20 group-hover:border-emerald-200"
                  }`}
                >
                  {task.done && (
                    <span className="text-[10px] text-black font-bold">
                      ✓
                    </span>
                  )}
                </button>

                <p
                  className={`flex-1 text-sm md:text-base ${
                    task.done
                      ? "line-through text-neutral-400"
                      : "text-neutral-50"
                  }`}
                >
                  {task.text}
                </p>

                <button
                  type="button"
                  onClick={() => deleteTask(task.id)}
                  className="text-xs text-neutral-400 hover:text-red-300 transition"
                >
                  excluir
                </button>
              </article>
            ))}
          </section>
        </div>

        {/* Créditozinho embaixo */}
        <p className="text-[11px] text-neutral-400 text-center mt-4">
          Construído em React/Next por você 💻
        </p>
      </div>
    </main>
  );
}

type FilterChipProps = {
  label: string;
  active: boolean;
  onClick: () => void;
};

function FilterChip({ label, active, onClick }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1 rounded-full border text-xs md:text-sm transition ${
        active
          ? "bg-emerald-300 text-black border-emerald-300"
          : "border-white/15 text-neutral-300 hover:border-emerald-200 hover:text-emerald-100"
      }`}
    >
      {label}
    </button>
  );
}
