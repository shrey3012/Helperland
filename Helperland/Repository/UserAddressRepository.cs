using Helperland.Data;
using Helperland.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Helperland.Repository
{
    public class UserAddressRepository : IUserAddressRepository
    {
        private readonly HelperLandContext helperlandContext;

        public UserAddressRepository(HelperLandContext helperlandContext)
        {
            this.helperlandContext = helperlandContext;
        }

        public int AddUserAddress(UserAddress userAddress)
        {
            helperlandContext.UserAddresses.Add(userAddress);
            return helperlandContext.SaveChanges();
        }

        public UserAddress GetAddressByAddressId(int addressid)
        {
            return helperlandContext.UserAddresses.Where(a => a.AddressId == addressid).FirstOrDefault();
        }
    }
}
