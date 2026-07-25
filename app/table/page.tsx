"use client";

import { Table, TableCard } from "@/components/application/table/table";
import { Avatar } from "@/components/base/avatar/avatar";
import { BadgeWithDot } from "@/components/base/badges/badges";

export default function TableDemoPage() {
  return (
    <div className="p-8 max-w-6xl mx-auto flex flex-col gap-6">
      <TableCard.Root>
        <TableCard.Header
          title="Team members"
          badge="100 users"
        />
        <Table aria-label="Team members">
          <Table.Header>
            <Table.Head id="name" label="Name" isRowHeader allowsSorting className="w-full max-w-1/4" />
            <Table.Head id="status" label="Status" allowsSorting />
            <Table.Head id="role" label="Role" allowsSorting />
            <Table.Head id="email" label="Email address" allowsSorting />
          </Table.Header>

          <Table.Body>
            <Table.Row id={1}>
              <Table.Cell>
                <div className="flex items-center gap-3">
                  <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=Chamreun" alt="Chamreun Vira" size="md" />
                  <div className="whitespace-nowrap">
                    <p className="text-sm font-medium text-primary">Chamreun Vira</p>
                    <p className="text-sm text-tertiary">@chamreun</p>
                  </div>
                </div>
              </Table.Cell>
              <Table.Cell>
                <BadgeWithDot size="sm" color="success" type="modern">
                  Active
                </BadgeWithDot>
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap text-secondary">Administrator</Table.Cell>
              <Table.Cell className="whitespace-nowrap text-tertiary">virachamruen@gmail.com</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </TableCard.Root>
    </div>
  );
}