using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Helperland.ViewModels
{
    public class updateServiceReqViewModel
    {
        [JsonPropertyName("ServiceRequestId")]
        public int ServiceRequestId { get; set; }
        [JsonPropertyName("ServiceStartDate")]
        public string ServiceStartDate { get; set; }
        [JsonPropertyName("ServiceStartTime")]
        public string ServiceStartTime { get; set; }
    }
}
