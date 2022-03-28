using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Helperland.ViewModels
{
    public class UpdateByAdminViewModel
    {
        [JsonPropertyName("serviceRequestId")]
        public int serviceRequestId { get; set; }
        
        [Required]
        [JsonPropertyName("serviceStartDate")]
        public string serviceStartDate { get; set; }
        
        [Required]
        [JsonPropertyName("serviceStartTime")]
        public string serviceStartTime { get; set; }
        
        [Required]
        [JsonPropertyName("addressLine1")]
        public string addressLine1 { get; set; }
        
        [Required]
        [JsonPropertyName("addressLine2")]
        public string addressLine2 { get; set; }
        
        [Required]
        [JsonPropertyName("city")]
        public string city { get; set; }
        
        [Required]
        [JsonPropertyName("state")]
        public string state { get; set; }

        [Required]
        [JsonPropertyName("postalCode")]
        public string postalCode { get; set; }
    }
}
