using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FullStack_CRUD_APP.Server.Migrations
{
    /// <inheritdoc />
    public partial class InitalCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TaskManager",
                columns: table => new
                {
                    TasksId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Who = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    What = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Where = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    When = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Why = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Done = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TaskManager", x => x.TasksId);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TaskManager");
        }
    }
}
