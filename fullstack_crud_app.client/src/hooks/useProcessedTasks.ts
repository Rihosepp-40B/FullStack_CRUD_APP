import { useEffect, useMemo, useState } from "react";
import type { Task } from "../types/task";
import { formDTG } from "../helpers/formDTG";

type SortDirection = "asc" | "desc";

interface SortRule {
    key: keyof Task;
    direction: SortDirection;
}

export function useProcessedTasks(initialTasks: Task[]) {

    // olekud filtreerimse ja sorteerimise jaoks ---
    const [searchFilters, setSearchFilters] = useState(() => {
        const savedFilters = localStorage.getItem("task_search_filters");
        return savedFilters ? JSON.parse(savedFilters) : {
            who: "",
            what: "",
            when: "",
            done: ""
        };
    });

    const [sortConfig, setSortConfig] = useState<SortRule[]>(() => {
        const savedSort = localStorage.getItem("task_sort_config");
        return savedSort ? JSON.parse(savedSort) : [
            { key: "done", direction: "asc" },
            { key: "when", direction: "asc" }
        ];
    });

    useEffect(() => {
        localStorage.setItem("task_search_filters", JSON.stringify(searchFilters));
    }, [searchFilters]);

    useEffect(() => {
        localStorage.setItem("task_sort_config", JSON.stringify(sortConfig));
    }, [sortConfig]);

    // filtreerimise ja sorteerimise loogika
    const processedTasks = useMemo(() => {
        let result = [...initialTasks];

        // filtreerimine
        if (searchFilters.who) {
            result = result.filter(t =>
                t.who.toLowerCase().includes(searchFilters.who.toLowerCase())
            );
        }
        if (searchFilters.what) {
            result = result.filter(t =>
                t.what.toLowerCase().includes(searchFilters.what.toLowerCase())
            );
        }
        if (searchFilters.when) {
            result = result.filter(t => {
                const formattedDate = formDTG(t.when).toLowerCase();
                return formattedDate.includes(searchFilters.when.toLowerCase()) ||
                    t.when.toLowerCase().includes(searchFilters.when.toLowerCase());
            });
        }
        if (searchFilters.done !== "") {
            const isDoneFilter = searchFilters.done === "true";
            result = result.filter(t => t.done === isDoneFilter);
        };

        // sorteerimine
        result.sort((a, b) => {

            for (const rule of sortConfig) {
                const { key, direction } = rule;
                let valueA = a[key];
                let valueB = b[key];

                // boolean sorteerimise käitlemine
                if (typeof valueA === "boolean" && typeof valueB === "boolean") {
                    if (valueA !== valueB) {
                        return direction === "asc"
                            ? (valueA ? 1 : -1)
                            : (valueA ? -1 : 1);
                    }
                    continue;
                }

                // stringide sorteerimine
                if (typeof valueA === "string") valueA = valueA.toLowerCase();
                if (typeof valueB === "string") valueB = valueB.toLowerCase();

                if (valueA < valueB) return direction === "asc" ? -1 : 1;
                if (valueA > valueB) return direction === "asc" ? 1 : -1;
            }

            return 0;
            });

        return result;
    }, [initialTasks, searchFilters, sortConfig]);

    const handleSort = (key: keyof Task) => {
        setSortConfig((prevConfig) => {
            const existingRuleIndex = prevConfig.findIndex(rule => rule.key === key);

            if (existingRuleIndex > -1) {
                const existingRule = prevConfig[existingRuleIndex];
                const updatedConfig = [...prevConfig];

                if (existingRule.direction === "asc") {
                    updatedConfig[existingRuleIndex] = { key, direction: "desc" };
                } else {
                    updatedConfig.splice(existingRuleIndex, 1);
                }
                return updatedConfig;
            } else {
                return [...prevConfig, { key, direction: "asc" }];
            }
        });
    };

    const handleFilterChange = (column: keyof typeof searchFilters, value: string) => {
        setSearchFilters((prev: Record<string, string>) => ({ ...prev, [column]: value }));
    };

    const getSortIndicator = (key: keyof Task) => {
        const rule = sortConfig.find(r => r.key === key);
        if (!rule) return " ↕";

        const ruleIndex = sortConfig.indexOf(rule) + 1;
        const arrow = rule.direction === "asc" ? " ↑" : " ↓";

        return `${arrow}${sortConfig.length > 1 ? ruleIndex : ""}`;
    };

    return {
        processedTasks,
        searchFilters,
        handleFilterChange,
        handleSort,
        getSortIndicator
    };
}
