
using FullStack_CRUD_APP.Server.Domain;
using Microsoft.EntityFrameworkCore;

namespace FullStack_CRUD_APP.Server.Data
{
	public class TaskContext : DbContext
	{
		public TaskContext(DbContextOptions<TaskContext> option) : base(option) // constructor
		{ }

		public DbSet<Tasks> Tasks { get; set; }

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			modelBuilder.Entity<Tasks>().ToTable("Tasks");
		}
	}
}