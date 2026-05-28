using FullStack_CRUD_APP.Server.Data;
using FullStack_CRUD_APP.Server.Domain;
using FullStack_CRUD_APP.Server.ViewModel;
using Microsoft.AspNetCore.Mvc;

namespace FullStack_CRUD_APP.Server.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class TasksController : ControllerBase
	{
		private readonly TaskContext _context; //Constructor

		public TasksController(TaskContext context)
		{
			_context = context;
		}

		public IActionResult TasksIndex()
		{
			var result = _context.Tasks
				.Select(x => new TasksListViewModel
				{
					TaskId = x.TaskId,
					Who = x.Who,
					What = x.What,
					Where = x.Where,
					When = x.When,
					Why = x.Why,
					Done = x.Done
				});

			return Ok(result);
		}

		[HttpPost]
		public IActionResult Create([FromBody] TasksCreateViewModel model)
		{
			if (string.IsNullOrWhiteSpace(model.Who))
			{
				return BadRequest("Who is required");
			}

			var task = new Tasks
			{
				TaskId = Guid.NewGuid(),
				Who = model.Who,
				What = model.What,
				Where = model.Where,
				When = model.When,
				Why = model.Why,
				Done = model.Done
			};

			_context.Tasks.Add(task);
			_context.SaveChanges();

			return Ok(new
			{
				taskId = task.TaskId,
				who = task.Who,
				what = task.What,
				where = task.Where,
				when = task.When,
				why = task.Why,
				done = task.Done
			});
		}

		// GET: api/tasks/{id}
		[HttpGet("{taskId:guid}")]
		public IActionResult Detail(Guid taskId)
		{
			var task = _context.Tasks
			.Where(x => x.TaskId == taskId)
			.Select(x => new TasksDetailViewModel
			{
				TaskId = x.TaskId,
				Who = x.Who,
				What = x.What,
				Where = x.Where,
				When = x.When,
				Why = x.Why,
				Done = x.Done
			})
			.FirstOrDefault();

			if (task == null)
			{
				return NotFound();
			}
			return Ok(task);
		}

		[HttpPut("{taskId:guid}")]
		public IActionResult Update(Guid taskId, [FromBody] TasksUpdateViewModel model)
		{
			var task = _context.Tasks.FirstOrDefault(x => x.TaskId == taskId);
			if (task == null)
			{
				return NotFound();	
			}

			if (string.IsNullOrWhiteSpace(model.Who))
			{
				return BadRequest("Who is required");
			}

			task.Who = model.Who;
			task.What = model.What;
			task.Where = model.Where;
			task.When = model.When;
			task.Done = model.Done;

			_context.SaveChanges();

			return Ok();
		}

		[HttpDelete("{taskId:guid}")]
		public IActionResult Delete(Guid taskId)
		{
			var task = _context.Tasks.FirstOrDefault(x => x.TaskId == taskId);
			if (task == null)
			{
				return NotFound();
			}

			_context.Tasks.Remove(task);
			_context.SaveChanges();
			return Ok();
		}
	}
}
