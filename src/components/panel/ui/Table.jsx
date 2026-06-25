import React, { useState, useMemo } from 'react';
import { Icon } from './Icon.jsx';

export function DataTable({ columns, rows, onRow, sort, onSort, rowClass }) {
  const emptyCount = Math.max(0, 5 - rows.length);
  return (
    <div className="tbl-wrap">
      <table className="tbl">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} className={c.sortable ? "sortable" : ""} style={c.width ? { width: c.width } : null}
                onClick={c.sortable ? () => onSort(c.key) : undefined}>
                <span className="th-in">
                  {c.label}
                  {c.sortable && sort && sort.key === c.key && <Icon name={sort.dir === "asc" ? "chevron-up" : "chevron-down"} />}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} onClick={() => onRow && onRow(r)} className={rowClass ? rowClass(r) : ""}>
              {columns.map((c) => <td key={c.key} className={c.align === "right" ? "right" : ""}>{c.render(r)}</td>)}
            </tr>
          ))}
          {Array.from({ length: emptyCount }).map((_, idx) => (
            <tr key={`empty-${idx}`} className="empty-row" style={{ cursor: "default", pointerEvents: "none" }}>
              {columns.map((c) => (
                <td key={c.key} className={c.align === "right" ? "right" : ""}>
                  <span style={{ visibility: "hidden" }}>&nbsp;</span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Pagination({ page, pages, total, perPage, onPage }) {
  if (total === 0) return null;
  const from = page * perPage + 1;
  const to = Math.min(total, (page + 1) * perPage);
  const nums = [];
  for (let i = 0; i < pages; i++) {
    if (i === 0 || i === pages - 1 || Math.abs(i - page) <= 1) nums.push(i);
    else if (nums[nums.length - 1] !== "…") nums.push("…");
  }
  return (
    <div className="pager">
      <span className="pager-info">{from}–{to} de {total}</span>
      <div className="pager-btns">
        <button className="pager-btn" disabled={page === 0} onClick={() => onPage(page - 1)} aria-label="Anterior"><Icon name="chevron-left" /></button>
        {nums.map((n, i) => n === "…"
          ? <span key={"e" + i} className="pager-info" style={{ padding: "0 4px" }}>…</span>
          : <button key={n} className={"pager-btn" + (n === page ? " active" : "")} onClick={() => onPage(n)}>{n + 1}</button>)}
        <button className="pager-btn" disabled={page >= pages - 1} onClick={() => onPage(page + 1)} aria-label="Siguiente"><Icon name="chevron-right" /></button>
      </div>
    </div>
  );
}

export function useListController(rows, { searchKeys, perPage = 10, defaultSort }) {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState(defaultSort || null);
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState({});

  const setFilter = (k, v) => { setFilters((f) => ({ ...f, [k]: v })); setPage(0); };
  const toggleSort = (key) => {
    setSort((s) => s && s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" });
  };

  const filtered = useMemo(() => {
    let out = rows.slice();
    if (q.trim()) {
      const needle = q.toLowerCase();
      out = out.filter((r) => searchKeys.some((k) => String(r[k] || "").toLowerCase().includes(needle)));
    }
    Object.keys(filters).forEach((k) => {
      const fv = filters[k];
      if (fv && fv !== "__all") {
        if (k === "__archived") {
          out = out.filter((r) => fv === "archived" ? r.archivado : !r.archivado);
        } else {
          out = out.filter((r) => String(r[k]) === fv);
        }
      }
    });
    if (sort) {
      out.sort((a, b) => {
        let av = a[sort.key], bv = b[sort.key];
        if (sort.key === "fecha") { av = new Date(av).getTime(); bv = new Date(bv).getTime(); }
        else { av = String(av || "").toLowerCase(); bv = String(bv || "").toLowerCase(); }
        if (av < bv) return sort.dir === "asc" ? -1 : 1;
        if (av > bv) return sort.dir === "asc" ? 1 : -1;
        return 0;
      });
    }
    return out;
  }, [rows, q, sort, filters, searchKeys]);

  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, pages - 1);
  const pageRows = filtered.slice(safePage * perPage, safePage * perPage + perPage);

  return { q, setQ, sort, toggleSort, filters, setFilter, page: safePage, setPage, pages, perPage, filtered, pageRows, total: filtered.length };
}
