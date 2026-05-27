namespace FullStack_CRUD_APP.Server.Domain
{
	public class Tasks
	{
		public Guid TaskId { get; set; }
		public string Who { get; set; } = string.Empty;
		public string What { get; set; } = string.Empty;
		public string Where {  get; set; } = string.Empty;
		public DateTime When { get; set; }
		public string Why { get; set; } = string.Empty;
	}
}