﻿using ClfApi.Context;
using ClfApi.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace ClfApi.Services
{
    public class ClfService : IClfService
    {
        private readonly ClfDbContext _context;

        public ClfService(ClfDbContext context)
        {
            _context = context;
        }

        public IEnumerable<Clf> List()
        {
            return _context.Clfs
                .OrderByDescending(clf => clf.RequestDate)
                .OrderByDescending(clf => clf.RequestTime)
                .Take(10);
        }

        public Clf Find(Guid id)
        {
            Clf clf = _context.Clfs
                .Where(clf => clf.Id == id)
                .FirstOrDefault();

            return clf;
        }

        public IEnumerable<Clf> FindByClient(string client)
        {
            IEnumerable<Clf> clfs = _context.Clfs
                .Where(clf => clf.Client == client)
                .ToList();

            return clfs;
        }

        public IEnumerable<Clf> FindByRequestDate(DateTimeOffset requestDateTime)
        {
            IEnumerable<Clf> clfs = _context.Clfs
                .Where(clf => clf.RequestDate == requestDateTime.UtcDateTime)
                .ToList();

            return clfs;
        }

        public IEnumerable<Clf> FindByUserAgent(string userAgent)
        {
            IEnumerable<Clf> clfs = _context.Clfs
                .Where(clf => clf.UserAgent == userAgent)
                .ToList();

            return clfs;
        }

        public Clf UpdateClf(Clf clf)
        {
            try
            {
                _context.Entry(clf).State = EntityState.Modified;
                _context.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClfExists(clf.Id))
                {
                    return null;
                }
                else
                {
                    throw;
                }
            }
            return clf;
        }

        public Clf CreateClf(Clf clf)
        {
            try
            {
                if (ClfExists(clf.Id))
                {
                    return null;
                }
                _context.Clfs.Add(clf);
                _context.SaveChanges();
            }
            catch (Exception e)
            {
                throw e;
            }
            return clf;
        }

        public void CreateMultipleClfs(IEnumerable<Clf> clfs)
        {
            try
            {
                _context.Clfs.AddRange(clfs);
                _context.SaveChanges();
            }
            catch (Exception e)
            {
                throw e;
            }
            return;
        }

        public Clf DeleteClf(Guid id)
        {
            Clf clf;
            try
            {
                clf = _context.Clfs.Find(id);
                if (clf == null)
                {
                    return null;
                }

                _context.Clfs.Remove(clf);
                _context.SaveChanges();
            }
            catch (Exception e)
            {
                throw e;
            }
            return clf;
        }

        public bool ClfExists(Guid id)
        {
            return _context.Clfs.Any(clf => clf.Id == id);
        }
    }

    public interface IClfService
    {
        IEnumerable<Clf> List();
        Clf Find(Guid id);
        IEnumerable<Clf> FindByClient(string client);
        IEnumerable<Clf> FindByRequestDate(DateTimeOffset requestDateTime);
        IEnumerable<Clf> FindByUserAgent(string userAgent);
        Clf UpdateClf(Clf clf);
        Clf CreateClf(Clf clf);
        void CreateMultipleClfs(IEnumerable<Clf> clfs);
        Clf DeleteClf(Guid id);
        bool ClfExists(Guid id);
    }
}
