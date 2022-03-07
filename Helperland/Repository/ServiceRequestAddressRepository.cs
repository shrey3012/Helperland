using Helperland.Data;
using Helperland.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Helperland.Repository
{
    public class ServiceRequestAddressRepository : IServiceRequestAddressRepository
    {
        private readonly HelperLandContext helperLandContext;

        public ServiceRequestAddressRepository(HelperLandContext helperLandContext)
        {
            this.helperLandContext = helperLandContext;
        }
        public int saveServiceRequestAddress(ServiceRequestAddress serviceRequestAddress)
        {

            helperLandContext.ServiceRequestAddresses.Add(serviceRequestAddress);
            return helperLandContext.SaveChanges();
        }
    }
}
