using Microsoft.EntityFrameworkCore;

namespace FullStack_CRUD_APP.Server.Data
{
	public class TaskManagerContext : DbContext
	{
		public TaskManagerContext(DbContextOptions<TaskManagerContext> option) : base(option) // constructor
		{ }

		public DbSet<Tasks> Tasks { get; set; }

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			modelBuilder.Entity<Tasks>().ToTable("TaskManager");
		}
	}
}