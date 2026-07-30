"use client";

import React, { useState } from "react";
import { ArrowLeft, ArrowRight, Edit01, HelpCircle, Trash01 } from "@untitledui/icons";
import { Table, TableCard, TableRowActionsDropdown } from "@/components/application/table/table";
import { Avatar } from "@/components/base/avatar/avatar";
import { Badge, BadgeWithDot } from "@/components/base/badges/badges";
import "@/styles/globals.css"
import "@/styles/theme.css"
import "@/styles/typography.css"

interface TeamMember {
  id: string;
  name: string;
  username: string;
  avatar: string;
  status: "Active" | "Offline";
  role: string;
  email: string;
  teams: { name: string; color: "purple" | "sky" | "indigo" }[];
  extraTeamsCount: number;
}

const mockMembers: TeamMember[] = [
  {
    id: "1",
    name: "Olivia Rhye",
    username: "@olivia",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia",
    status: "Active",
    role: "Product Designer",
    email: "olivia@untitledui.com",
    teams: [
      { name: "Design", color: "purple" },
      { name: "Product", color: "sky" },
      { name: "Marketing", color: "indigo" },
    ],
    extraTeamsCount: 4,
  },
  {
    id: "2",
    name: "Phoenix Baker",
    username: "@phoenix",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Phoenix",
    status: "Active",
    role: "Product Manager",
    email: "phoenix@untitledui.com",
    teams: [
      { name: "Design", color: "purple" },
      { name: "Product", color: "sky" },
      { name: "Marketing", color: "indigo" },
    ],
    extraTeamsCount: 4,
  },
  {
    id: "3",
    name: "Lana Steiner",
    username: "@lana",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lana",
    status: "Active",
    role: "Frontend Developer",
    email: "lana@untitledui.com",
    teams: [
      { name: "Design", color: "purple" },
      { name: "Product", color: "sky" },
      { name: "Marketing", color: "indigo" },
    ],
    extraTeamsCount: 2,
  },
  {
    id: "4",
    name: "Demi Wilkinson",
    username: "@demi",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Demi",
    status: "Active",
    role: "Backend Developer",
    email: "demi@untitledui.com",
    teams: [
      { name: "Design", color: "purple" },
      { name: "Product", color: "sky" },
      { name: "Marketing", color: "indigo" },
    ],
    extraTeamsCount: 1,
  },
  {
    id: "5",
    name: "Candice Wu",
    username: "@candice",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Candice",
    status: "Active",
    role: "Fullstack Developer",
    email: "candice@untitledui.com",
    teams: [
      { name: "Design", color: "purple" },
      { name: "Product", color: "sky" },
      { name: "Marketing", color: "indigo" },
    ],
    extraTeamsCount: 2,
  },
  {
    id: "6",
    name: "Natali Craig",
    username: "@natali",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Natali",
    status: "Active",
    role: "UX Designer",
    email: "natali@untitledui.com",
    teams: [
      { name: "Design", color: "purple" },
      { name: "Product", color: "sky" },
      { name: "Marketing", color: "indigo" },
    ],
    extraTeamsCount: 2,
  },
  {
    id: "7",
    name: "Drew Cano",
    username: "@drew",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Drew",
    status: "Active",
    role: "UX Copywriter",
    email: "drew@untitledui.com",
    teams: [
      { name: "Design", color: "purple" },
      { name: "Product", color: "sky" },
      { name: "Marketing", color: "indigo" },
    ],
    extraTeamsCount: 4,
  },
  {
    id: "8",
    name: "Orlando Diggs",
    username: "@orlando",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Orlando",
    status: "Active",
    role: "UI Designer",
    email: "orlando@untitledui.com",
    teams: [
      { name: "Design", color: "purple" },
      { name: "Product", color: "sky" },
      { name: "Marketing", color: "indigo" },
    ],
    extraTeamsCount: 4,
  },
  {
    id: "9",
    name: "Andi Lane",
    username: "@andi",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Andi",
    status: "Active",
    role: "Product Manager",
    email: "andi@untitledui.com",
    teams: [
      { name: "Design", color: "purple" },
      { name: "Product", color: "sky" },
      { name: "Marketing", color: "indigo" },
    ],
    extraTeamsCount: 4,
  },
  {
    id: "10",
    name: "Kate Morrison",
    username: "@kate",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kate",
    status: "Active",
    role: "QA Engineer",
    email: "kate@untitledui.com",
    teams: [
      { name: "Design", color: "purple" },
      { name: "Product", color: "sky" },
      { name: "Marketing", color: "indigo" },
    ],
    extraTeamsCount: 2,
  },
];

export default function TableDemoPage() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto flex flex-col gap-6">
      <TableCard.Root>
        <TableCard.Header
          title="Team members"
          badge="100 users"
          contentTrailing={<TableRowActionsDropdown />}
        />

        <Table aria-label="Team members table" selectionMode="multiple">
          <Table.Header>
            <Table.Head id="name" label="Name" isRowHeader allowsSorting />
            <Table.Head id="status" label="Status" allowsSorting />
            <Table.Head id="role" label="Role" allowsSorting tooltip="Member job position or title" />
            <Table.Head id="email" label="Email address" allowsSorting />
            <Table.Head id="teams" label="Teams" />
            <Table.Head id="actions" />
          </Table.Header>

          <Table.Body items={mockMembers}>
            {(item) => (
              <Table.Row id={item.id}>
                <Table.Cell>
                  <div className="flex items-center gap-3">
                    <Avatar src={item.avatar} alt={item.name} size="md" />
                    <div className="whitespace-nowrap">
                      <p className="text-sm font-semibold text-primary">{item.name}</p>
                      <p className="text-sm text-tertiary">{item.username}</p>
                    </div>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <BadgeWithDot size="sm" color={item.status === "Active" ? "success" : "gray"} type="modern">
                    {item.status}
                  </BadgeWithDot>
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap text-secondary font-medium">
                  {item.role}
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap text-tertiary">
                  {item.email}
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center gap-1.5">
                    {item.teams.map((t) => (
                      <Badge key={t.name} type="pill-color" color={t.color} size="sm">
                        {t.name}
                      </Badge>
                    ))}
                    {item.extraTeamsCount > 0 && (
                      <Badge color="gray" size="sm" type="modern">
                        +{item.extraTeamsCount}
                      </Badge>
                    )}
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-tertiary transition hover:bg-secondary hover:text-primary"
                      title="Delete member"
                    >
                      <Trash01 className="size-4" />
                    </button>
                    <button
                      type="button"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-tertiary transition hover:bg-secondary hover:text-primary"
                      title="Edit member"
                    >
                      <Edit01 className="size-4" />
                    </button>
                  </div>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>

        {/* Untitled UI Pagination Bar */}
        <div className="flex items-center justify-between border-t border-secondary bg-primary px-4 py-3 md:px-6">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="inline-flex items-center gap-2 rounded-lg border border-secondary bg-primary px-3 py-2 text-sm font-semibold text-secondary shadow-xs transition hover:bg-secondary hover:text-primary"
          >
            <ArrowLeft className="size-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold transition ${
                  currentPage === page
                    ? "bg-secondary text-primary font-bold shadow-xs"
                    : "text-tertiary hover:bg-secondary hover:text-primary"
                }`}
              >
                {page}
              </button>
            ))}
            <span className="px-1 text-sm text-tertiary">...</span>
            <button
              type="button"
              onClick={() => setCurrentPage(10)}
              className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold transition ${
                currentPage === 10
                  ? "bg-secondary text-primary font-bold shadow-xs"
                  : "text-tertiary hover:bg-secondary hover:text-primary"
              }`}
            >
              10
            </button>
          </div>

          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(10, p + 1))}
            className="inline-flex items-center gap-2 rounded-lg border border-secondary bg-primary px-3 py-2 text-sm font-semibold text-secondary shadow-xs transition hover:bg-secondary hover:text-primary"
          >
            <span>Next</span>
            <ArrowRight className="size-4" />
          </button>
        </div>
      </TableCard.Root>
    </div>
  );
}