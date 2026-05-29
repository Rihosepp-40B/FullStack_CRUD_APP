using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FullStack_CRUD_APP.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddPrimaryKey : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_TaskManager",
                table: "TaskManager");

            migrationBuilder.RenameTable(
                name: "TaskManager",
                newName: "Tasks");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Tasks",
                table: "Tasks",
                column: "TasksId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Tasks",
                table: "Tasks");

            migrationBuilder.RenameTable(
                name: "Tasks",
                newName: "TaskManager");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TaskManager",
                table: "TaskManager",
                column: "TasksId");
        }
    }
}
